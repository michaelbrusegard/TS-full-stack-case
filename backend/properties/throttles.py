from rest_framework.throttling import AnonRateThrottle

class PropertyRateThrottle(AnonRateThrottle):
    rate = '100/minute'
