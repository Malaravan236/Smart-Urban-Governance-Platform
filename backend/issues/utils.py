import geohash2
from PIL import Image
import imagehash

def get_geohash(lat, lng, precision=7):
    try:
        return geohash2.encode(float(lat), float(lng), precision)
    except:
        return ""

def get_image_hash(image_path):
    try:
        return str(imagehash.phash(Image.open(image_path)))
    except Exception as e:
        print(f"Hash error: {e}")
        return ""

def find_duplicate_issue(new_issue, radius_meters=100):
    from .models import Issue

    try:
        # Check same geohash prefix (approx 76m for 6 chars)
        gh = get_geohash(new_issue.latitude, new_issue.longitude)[:6]
        if not gh:
            return None
            
        candidates = Issue.objects.filter(
            geohash__startswith=gh, 
            category=new_issue.category
        ).exclude(id=new_issue.id)
        
        for c in candidates:
            if c.category == new_issue.category:
                return c
        return None
    except Exception as e:
        print(f"Duplicate check error: {e}")
        return None