from rest_framework.routers import DefaultRouter
from .views import IssueViewSet

router=DefaultRouter()
router.register(r'issues', IssueViewSet)

urlpatterns=router.urls