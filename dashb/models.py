import django.conf
from django.db import models
from django.contrib.auth.models import User


lighter_color_map = {
    'purple': '#d0b0ff',
    'red': 'pink',
    'yellow': '#ffffc8'
}

darker_color_map = {
    'yellow': 'gold'
}

GRID_SIZE = 12      # max number of apps in grid


class AppInfo(models.Model):
    """Info about an App to be displayed in the Dashboard
    """
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=200)
    color = models.CharField(max_length=20)
    default_status = models.BooleanField()
    link = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name
    
    def lighter_color(self):
        color = self.color.lower()
        return lighter_color_map.get(color, 'light' + color)
    
    def darker_color(self):
        color = self.color.lower()
        return darker_color_map.get(color, color)


class DashUser(models.Model):
    """Dashboard User"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # List of appnames, one per grid slot, as comma-separated string
    #   ('' if slot is empty)
    appgrid = models.CharField(max_length=120)

