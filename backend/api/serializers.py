from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Event, Attendance


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='user.username', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'user', 'event', 'checked_in', 'check_in_time', 'username', 'event_title']
        read_only_fields = ['id', 'user', 'check_in_time', 'username', 'event_title']