from rest_framework import serializers
from .models import Issue, Comment

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'issue']

class IssueSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Issue
        fields = '__all__'
        read_only_fields = ['user','geohash','image_hash','support_count','status','duplicate_of'] 
        extra_kwargs = {
            'photo': {'required': False},  
            'latitude': {'required': False},
            'longitude': {'required': False},
        }