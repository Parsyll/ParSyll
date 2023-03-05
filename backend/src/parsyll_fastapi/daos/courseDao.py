from parsyll_fastapi.database import db
from parsyll_fastapi.models.model import Course, CourseBase
from typing import List

class CourseDAO:
    user_collection_name = "users"
    collection_name = "courses"

    # create returns course_id that was created
    def create(self, uid: str, course: CourseBase) -> str:
        user_ref = db.collection(self.user_collection_name).document(uid)
        course_doc = user_ref.collection(self.collection_name).document()

        data = course.dict()
        data["id"] = course_doc.id
        course_doc.set(data)

        return course_doc.id

    def get(self, uid: str, course_id: str) -> Course:
        user_ref = db.collection(self.user_collection_name).document(uid)
        if not user_ref.get().exists:
            return None

        course_ref = user_ref.collection(self.collection_name)
        course_doc = course_ref.document(course_id).get()
        if not course_doc.exists:
            return None

        return Course(**course_doc.to_dict())

    def get_all(self, uid: str) -> List[Course]:
        user_ref = db.collection(self.user_collection_name).document(uid)
        if not user_ref.get().exists:
            return None
        
        course_ref = user_ref.collection(self.collection_name)
        course_list = []
        for course_doc in course_ref.stream():
            course_list.append(Course(**course_doc.to_dict())) 

        return course_list

    def update(self, uid: str, course_id: str, course: Course) -> Course:
        data = course.dict()
        user_ref = db.collection(self.user_collection_name).document(uid)
        if not user_ref.get().exists:
            return None

        course_doc_ref = user_ref.collection(self.collection_name).document(course_id)

        if not course_doc_ref.get().exists:
            return None

        if data["id"] != course_id:
            data["id"] = course_id

        course_doc_ref.update(data)

        return self.get(uid, course_id)

    def delete(self, uid: str, course_id: str) -> None:
        user_ref = db.collection(self.user_collection_name).document(uid)
        course_doc = user_ref.collection(self.collection_name).document(course_id)
        course_doc.delete()
