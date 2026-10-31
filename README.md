# Smart-Urban-Governance-Platform
CivicFix is a Full Stack Smart City Issue Reporting Platform where citizens can report civic problems (potholes, garbage, streetlights) with photos &amp; geolocation. Built with Django REST Framework &amp; React, featuring duplicate detection, geohash-based nearby search, rate limiting, and audit timeline.
Report, Track, Resolve - Making Cities Smarter

## Features
- 📍 Geospatial Nearby Search (Haversine + Geohash)
- 🔍 Advanced Filter & Search
- 🚨 Duplicate Detection (Image + Location)
- 🛡️ Rate Limiting / Throttling
- 📈 Audit Timeline & Heatmap Analytics

## Tech Stack
- Backend: Django, DRF, JWT, Django-Filter
- Frontend: React, Leaflet Maps
- Database: MySQL

## Setup
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
