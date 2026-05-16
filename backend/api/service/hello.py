from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..model.model import Hello
from ..serializers import HelloSerializer
from ..utils.api_response import api_response, ApiResponseStatus, ErrorMessageType

@api_view(['POST'])
def HelloService(request):
    try:
        serializer = HelloSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(api_response(
                status=ApiResponseStatus.SUCCESS,
                data=serializer.data
            ))
        else:
            return Response(api_response(
                status=ApiResponseStatus.ERROR,
                error={
                    "type": ErrorMessageType.ERROR,
                    "message":"Invalid Username or Password"
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
        
