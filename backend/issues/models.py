from django.db import models

from django.contrib.auth.models import User

class Issue(models.Model):
    CATEGORY=[('pothole','Pothole'),('garbage','Garbage'),('streetlight','Streetlight'),('water','Water Leak')]
    STATUS=[('open','Open'),('in_progress','In Progress'),('resolved','Resolved'),('duplicate','Duplicate')]

    user=models.ForeignKey(User,on_delete=models.CASCADE)
    title=models.CharField(max_length=200)
    description=models.TextField()
    category=models.CharField(max_length=20, choices=CATEGORY)
    status=models.CharField(max_length=20, choices=STATUS, default='open')

    latitude=models.FloatField()
    longitude=models.FloatField()
    geohash=models.CharField(max_length=12, blank=True)
    address=models.CharField(max_length=300, blank=True)

    photo=models.ImageField(upload_to='issues/')
    image_hash=models.CharField(max_length=64, blank=True)

    duplicate_of=models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    support_count=models.IntegerField(default=1)

    created_at=models.DateTimeField(auto_now_add=True)

class IssueSupport(models.Model):
    issue=models.ForeignKey(Issue, on_delete=models.CASCADE)
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    class Meta:
        unique_together=('issue','user')

class Comment(models.Model):
    issue=models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='comments')
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    text=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

class AdminAction(models.Model):
    issue=models.ForeignKey(Issue, on_delete=models.CASCADE)
    admin=models.ForeignKey(User, on_delete=models.CASCADE)
    action=models.CharField(max_length=100)
    remarks=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)    


