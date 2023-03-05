from parsyll_fastapi.database import db
from parsyll_fastapi.models.model import Course, CourseBase

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
        course_ref = user_ref.collection(self.collection_name)
        course_doc = course_ref.document(course_id).get()
        if course_doc.exists:
            return Course(**course_doc.to_dict())
        return None

    def get_all(self, uid: str) -> Course:
        user_ref = db.collection(self.user_collection_name).document(uid)
        course_ref = user_ref.collection(self.collection_name)

        course_list = []
        for course_doc in course_ref.stream():
            course_list.append(Course(**course_doc.to_dict())) 

        return course_list

    def update(self, uid: str, course_id: str, course: Course) -> Course:
        data = course.dict()
        user_ref = db.collection(self.user_collection_name).document(uid)
        course_doc = user_ref.collection(self.collection_name).document(course_id)

        if data["id"] != course_id:
            data["id"] = course_id

        course_doc.update(data)

        return self.get(uid, course_id)

    def delete(self, uid: str, course_id: str) -> None:
        user_ref = db.collection(self.user_collection_name).document(uid)
        course_doc = user_ref.collection(self.collection_name).document(course_id)
        course_doc.delete()
