from parsyll_fastapi.database import db
from parsyll_fastapi.models.model import User, UserResponse
from parsyll_fastapi.daos.courseDao import CourseDAO
from typing import List

course_dao = CourseDAO()

class UserDAO:
    collection_name = "users"

    def create(self):
        pass

    def get(self, uid: str) -> UserResponse:
        
        user_doc_ref = db.collection(self.collection_name).document(uid)
        user_doc = user_doc_ref.get()
        if not user_doc.exists:
            return None
        
        user_dict = user_doc.to_dict()
        courses_list = course_dao.get_all(uid) 
        user_dict['courses'] = courses_list

        return UserResponse(**user_dict)

    def get_all(self) -> List[UserResponse]:
        user_ref = db.collection(self.collection_name)
        user_list = []
        for user_doc in user_ref.stream():
            user_dict = user_doc.to_dict()
            user_dict['courses'] = course_dao.get_all(user_doc.id)
            user_list.append(UserResponse(**user_dict))

        return user_list

    def update(self, uid: str, user: User) -> User:
        data = user.dict()
        user_doc_ref = db.collection(self.collection_name).document(uid)

        user_doc = user_doc_ref.get()
        if not user_doc.exists:
            return None

        if data['uid'] != uid:
            data['uid'] = uid

        user_doc_ref.update(data)
        
        return self.get(uid)

    def delete(self):
        pass