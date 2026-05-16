from rest_framework import serializers
from .model.model import Hello,TaskAppUser, Task, TaskHistory

class HelloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hello
        fields = ['name', 'email']


# from rest_framework import serializers
# from .model.model import 


# -----------------------------
# User Serializer
# -----------------------------
class TaskAppUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskAppUser
        fields = [
            'id',
            'full_name',
            'email',
            'password',
            'role',
            'is_active',
            'created_at',
            'updated_at'
        ]

        extra_kwargs = {
            'password': {'write_only': True}
        }


# -----------------------------
# Task Serializer
# -----------------------------
class TaskSerializer(serializers.ModelSerializer):

    created_by_name = serializers.CharField(
        source='created_by.full_name',
        read_only=True
    )

    assigned_to_name = serializers.CharField(
        source='assigned_to.full_name',
        read_only=True
    )

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'status',
            'priority',
            'created_by',
            'created_by_name',
            'assigned_to',
            'assigned_to_name',
            'created_at',
            'updated_at'
        ]


# -----------------------------
# Task History Serializer
# -----------------------------
class TaskHistorySerializer(serializers.ModelSerializer):

    updated_by_name = serializers.CharField(
        source='updated_by.full_name',
        read_only=True
    )

    class Meta:
        model = TaskHistory
        fields = [
            'id',
            'task',
            'old_status',
            'new_status',
            'updated_by',
            'updated_by_name',
            'updated_at'
        ]


# -----------------------------
# Login Serializer
# -----------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)