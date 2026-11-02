from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Issue, IssueSupport, Comment, AdminAction
from .serializers import IssueSerializer, CommentSerializer
from .utils import find_duplicate_issue, get_geohash, get_image_hash
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all().order_by('-created_at')
    serializer_class = IssueSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'geohash']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'support_count']

    def get_permissions(self):
        if self.action == 'destroy':
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def perform_destroy(self, instance):
        if instance.user != self.request.user and not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only delete your own issues."
            )

        instance.delete()

    def perform_create(self, serializer):
        lat = serializer.validated_data.get('latitude')
        lon = serializer.validated_data.get('longitude')
        issue = serializer.save(user=self.request.user, geohash=get_geohash(lat, lon) if lat and lon else "")
        
        if issue.photo:
            try:
                issue.image_hash = get_image_hash(issue.photo.path)
            except:
                pass
        
        dup = find_duplicate_issue(issue)
        if dup:
            issue.status = 'duplicate'
            issue.duplicate_of = dup 
            dup.support_count += 1
            dup.save()
        issue.save()

    @action(detail=True, methods=['post'])
    def support(self, request, pk=None):
        issue = self.get_object()
        obj, created = IssueSupport.objects.get_or_create(issue=issue, user=request.user)
        if not created:
            return Response({"msg": "Already supported"}, status=400)
        issue.support_count = IssueSupport.objects.filter(issue=issue).count()
        issue.save()
        return Response({"support_count": issue.support_count})

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        issue = self.get_object()
        if request.method == 'GET':
            return Response(CommentSerializer(issue.comments.all(), many=True).data)
        Comment.objects.create(issue=issue, user=request.user, text=request.data['text'])
        return Response({"msg": "Comment added"})

    @action(detail=False, methods=['get'])
    def my_reports(self, request):
        return Response(IssueSerializer(Issue.objects.filter(user=request.user), many=True).data)

    @action(detail=False, methods=['get'])
    def nearby(self, request):
        try:
            lat = float(request.query_params.get('lat'))
            lon = float(request.query_params.get('lon'))
            radius_km = float(request.query_params.get('radius', 0.5)) # default 500m
            
            # Geohash precision: 7 = ~150m, 6 = ~1km
            # Same area geohash match + manual distance filter
            from .utils import get_geohash
            import math

            def haversine(lat1, lon1, lat2, lon2):
                R = 6371 # Earth radius km
                dlat = math.radians(lat2-lat1)
                dlon = math.radians(lon2-lon1)
                a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2)**2
                return R * 2 * math.asin(math.sqrt(a))

            # First filter by geohash prefix (fast)
            base_geohash = get_geohash(lat, lon)[:5] # 5 char = ~5km box
            candidates = Issue.objects.filter(geohash__startswith=base_geohash)
            
            nearby_issues = []
            for issue in candidates:
                if issue.latitude and issue.longitude:
                    dist = haversine(lat, lon, float(issue.latitude), float(issue.longitude))
                    if dist <= radius_km:
                        nearby_issues.append(issue)
            
            return Response(IssueSerializer(nearby_issues, many=True).data)
        except Exception as e:
            return Response({"error": str(e), "msg": "Use ?lat=11.66&lon=78.14&radius=0.5"}, status=400)    

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        return Response({
            'total': Issue.objects.count(),
            'by_category': list(Issue.objects.values('category').annotate(count=Count('id'))),
            'by_status': list(Issue.objects.values('status').annotate(count=Count('id'))),
            'heatmap_data': list(Issue.objects.values('latitude', 'longitude', 'category'))
        })

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def resolve(self, request, pk=None):
        issue = self.get_object()
        old_status = issue.status
        new_status = request.data.get('status', 'resolved')
        issue.status = new_status
        issue.save()
        
        # Auto Timeline Comment
        Comment.objects.create(
            issue=issue, 
            user=request.user, 
            text=f"🚀 Status changed: {old_status} → {new_status}. Remarks: {request.data.get('remarks', 'No remarks')}"
        )
        
        AdminAction.objects.create(issue=issue, admin=request.user, action=f"Status->{issue.status}", remarks=request.data.get('remarks', ''))
        return Response({"msg": f"Marked {issue.status}", "timeline_added": True})