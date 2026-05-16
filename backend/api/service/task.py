# from rest_framework.decorators import (
#     api_view,
#     permission_classes
# )

# from rest_framework.permissions import (
#     IsAuthenticated
# )

# from rest_framework.response import Response

# from ..model.model import (
#     Task,
#     TaskAppUser
# )

# from ..serializers import TaskSerializer

# from ..utils.api_response import (
#     api_response,
#     ApiResponseStatus,
#     ErrorMessageType
# )


# # --------------------------------
# # Create Task API (Admin Only)
# # --------------------------------
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def CreateTaskService(request):
#     try:

#         # Admin Check
#         if request.user.role != 'admin':
#             return Response(api_response(
#                 status=ApiResponseStatus.ERROR,
#                 error={
#                     "type": ErrorMessageType.ERROR,
#                     "message": "Only admin can create task"
#                 }
#             ))

#         assigned_to_id = request.data.get('assigned_to')

#         # Check User Exists
#         try:
#             assigned_user = TaskAppUser.objects.get(
#                 id=assigned_to_id
#             )

#         except TaskAppUser.DoesNotExist:
#             return Response(api_response(
#                 status=ApiResponseStatus.ERROR,
#                 error={
#                     "type": ErrorMessageType.ERROR,
#                     "message": "Assigned user not found"
#                 }
#             ))

#         task_data = {
#             "title": request.data.get("title"),
#             "description": request.data.get("description"),
#             "priority": request.data.get("priority"),
#             "assigned_to": assigned_user.id,
#             "created_by": request.user.id,
#             "status": "pending"
#         }

#         serializer = TaskSerializer(data=task_data)

#         if serializer.is_valid():
#             serializer.save()

#             return Response(api_response(
#                 status=ApiResponseStatus.SUCCESS,
#                 data=serializer.data
#             ))

#         return Response(api_response(
#             status=ApiResponseStatus.ERROR,
#             error={
#                 "type": ErrorMessageType.ERROR,
#                 "message": serializer.errors
#             }
#         ))

#     except Exception as e:
#         return Response(api_response(
#             status=ApiResponseStatus.ERROR,
#             error={
#                 "type": ErrorMessageType.EXCEPTION,
#                 "message": str(e)
#             }
#         ))
    



from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..utils.jwt_auth import get_logged_user

from ..model.model import (
    TaskAppUser,Task,TaskHistory
)

from ..serializers import TaskSerializer

from ..utils.api_response import (
    api_response,
    ApiResponseStatus,
    ErrorMessageType
)


@api_view(['POST'])
def CreateTaskService(request):
    print("print in header",request.headers)
    try:

        logged_user = get_logged_user(request)
        print("LOGGED USER:", logged_user)

        if not logged_user:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Unauthorized User"
                }
            ))

        # Admin Check
        if logged_user.role != 'admin':
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Only admin can create task"
                }
            ))

        assigned_to_id = request.data.get(
            'assigned_to'
        )

        assigned_user = TaskAppUser.objects.get(
            id=assigned_to_id
        )

        task_data = {
            "title": request.data.get("title"),
            "description": request.data.get("description"),
            "priority": request.data.get("priority"),
            "assigned_to": assigned_user.id,
            "created_by": logged_user.id,
            "status": "pending"
        }

        serializer = TaskSerializer(
            data=task_data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(api_response(
                status=ApiResponseStatus.SUCCESS,
                data=serializer.data
            ))

        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.ERROR,
                "message": serializer.errors
            }
        ))

    except Exception as e:
        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.EXCEPTION,
                "message": str(e)
            }
        ))
    

# --------------------------------
# Get All Tasks API (Admin Only)
# --------------------------------
@api_view(['GET'])
def GetAllTaskService(request):
    try:

        logged_user = get_logged_user(request)

        if not logged_user:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Unauthorized User"
                }
            ))

        # Admin Check
        if logged_user.role != 'admin':
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Only admin can view all tasks"
                }
            ))

        tasks = Task.objects.all().order_by('-id')

        serializer = TaskSerializer(
            tasks,
            many=True
        )

        return Response(api_response(
            status=ApiResponseStatus.SUCCESS,
            data=serializer.data
        ))

    except Exception as e:
        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.EXCEPTION,
                "message": str(e)
            }
        ))
    
# --------------------------------
# Update Task Status API (User)
# --------------------------------
@api_view(['PUT'])
def UpdateTaskStatusService(request, task_id):
    try:

        logged_user = get_logged_user(request)

        if not logged_user:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Unauthorized User"
                }
            ))

        # Find Task
        try:
            task = Task.objects.get(
                id=task_id
            )

        except Task.DoesNotExist:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Task not found"
                }
            ))

        # Check assigned user
        if task.assigned_to.id != logged_user.id:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "You are not assigned to this task"
                }
            ))

        status_value = request.data.get(
            'status'
        )

        allowed_status = [
            'pending',
            'in_progress',
            'completed'
        ]

        if status_value not in allowed_status:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Invalid status"
                }
            ))

        old_status = task.status

        # Update status
        task.status = status_value
        task.save()

        # Save History (Optional)
        TaskHistory.objects.create(
            task=task,
            old_status=old_status,
            new_status=status_value,
            updated_by=logged_user
        )

        serializer = TaskSerializer(task)

        return Response(api_response(
            status=ApiResponseStatus.SUCCESS,
            data=serializer.data
        ))

    except Exception as e:
        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.ERROR,
                "message": str(e)
            }
        ))
    
# --------------------------------
# Get Assigned Tasks API (User)
# --------------------------------
@api_view(['GET'])
def GetAssignedTaskService(request):
    try:

        logged_user = get_logged_user(request)

        if not logged_user:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Unauthorized User"
                }
            ))

        tasks = Task.objects.filter(
            assigned_to=logged_user.id
        ).order_by('-id')

        serializer = TaskSerializer(
            tasks,
            many=True
        )

        return Response(api_response(
            status=ApiResponseStatus.SUCCESS,
            data=serializer.data
        ))

    except Exception as e:
        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.ERROR,
                "message": str(e)
            }
        ))




# --------------------------------
# Find All Tasks API
# Admin -> All Tasks
# User -> Assigned Tasks Only
# --------------------------------



@api_view(['GET'])
def FindAllTaskService(request):
    try:

        logged_user = get_logged_user(request)

        if not logged_user:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message": "Unauthorized User"
                }
            ))

        # Admin -> all tasks
        if logged_user.role == 'admin':
            tasks = Task.objects.select_related(
                'created_by',
                'assigned_to'
            ).all()

        # User -> assigned tasks only
        else:
            tasks = Task.objects.select_related(
                'created_by',
                'assigned_to'
            ).filter(
                assigned_to=logged_user
            )

        serializer = TaskSerializer(
            tasks.order_by('-id'),
            many=True
        )

        # Status Count
        pending_count = tasks.filter(
            status='pending'
        ).count()

        in_progress_count = tasks.filter(
            status='in_progress'
        ).count()

        completed_count = tasks.filter(
            status='completed'
        ).count()

        # Priority Count
        high_priority = tasks.filter(
            priority='high'
        ).count()

        medium_priority = tasks.filter(
            priority='medium'
        ).count()

        low_priority = tasks.filter(
            priority='low'
        ).count()

        return Response(api_response(
            status=ApiResponseStatus.SUCCESS,
            data={
                "summary": {
                    "total_tasks": tasks.count(),

                    "status": {
                        "pending": pending_count,
                        "in_progress": in_progress_count,
                        "completed": completed_count
                    },

                    "priority": {
                        "high": high_priority,
                        "medium": medium_priority,
                        "low": low_priority
                    }
                },

                "tasks": serializer.data
            }
        ))

    except Exception as e:
        return Response(api_response(
            status=ApiResponseStatus.ERROR,
            error={
                "type": ErrorMessageType.ERROR,
                "message": str(e)
            }
        ))




