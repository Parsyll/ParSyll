from parsyll_fastapi.models.model import User, UserResponse, Course
from parsyll_fastapi.database import auth

class MockUserRecord():
    """Contains metadata associated with a Firebase user account."""

    def __init__(self, uid, display_name, email):
        self.uid = uid
        self.display_name = display_name
        self.email = email

class MockUser():
    def __init__(self, uid, display_name, email):
        self.uid = uid
        self.display_name = display_name
        self.email = email
        self.user = User(uid="test123", username="test123", email="123@gmail.com")
        self.mockUserResponse = UserResponse(uid="test123", username="test123", email="123@gmail.com", courses=[])
        self.mockUserRecord = MockUserRecord(self.uid, self.display_name, self.email)
        self.userdict = {"uid":"test123", "email":"test123@gmail.com", "username":"test123"}
    
    def mock_create_user_success(self, *args, **kwargs):
        return 200
    
    def mock_create_user_fail(self, *args, **kwargs):
        return 500
    
    def mock_auth_get_user_success(self, *args, **kwargs):
        return self.mockUserRecord
    
    def mock_auth_get_user_fail(self, *args, **kwargs):
        return None
    
    def mock_userdao_get_all(self, *args, **kwargs):
        return [self.mockUserResponse, self.mockUserResponse]
    
    def mock_userdao_get_success(self, *args, **kwargs):
        return self.mockUserResponse
    
    def mock_userdao_get_fail(self, *args, **kwargs):
        return None
    
    def mock_userdao_update_success(self, *args, **kwargs):
        return self.mockUserResponse
    
    def mock_userdao_update_fail(self, *args, **kwargs):
        return None
    
    def mock_auth_get_user_not_found(self, *args, **kwargs):
        raise auth.UserNotFoundError
    
    def mock_auth_delete_user_success(self, *args, **kwargs):
        return None

    def mock_auth_delete_user_fail(self, *args, **kwargs):
        raise auth.UserNotFoundError
    
    def mock_delete_collection_success(self, *args, **kwargs):
        return None
    
    def mock_delete_collection_fail(self, *args, **kwargs):
        return ValueError