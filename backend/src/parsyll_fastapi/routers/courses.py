from fastapi import APIRouter, Request, Depends, Response, Body
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from typing import List
from parsyll_fastapi.models.model import User, Course, CourseBase
from parsyll_fastapi.database import db, auth
from parsyll_fastapi.daos.courseDao import CourseDAO
from parsyll_fastapi.auth.auth_bearer import JWTBearer
from parsyll_fastapi.parsing.parser_class import Parser

router = APIRouter(prefix="/courses", tags=["courses"])
course_dao = CourseDAO()

@router.post("/{uid}",
             description= "API endpoint to create course."
             )
def create_course(uid: str, course: CourseBase = Body(...)):
    course_id = course_dao.create(uid, course)
    return course_id


@router.get("/{uid}/{course_id}",
            response_model=Course,
            description="Get course by user_id and course_id." 
            )
def get_course(uid: str, course_id: str):
    course = course_dao.get(uid, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Invalid user id or course id")
    return course


@router.get("/{uid}", 
            response_model=List[Course],
            description="Get all courses that a specific user has by their uid." 
            )
def list_courses(uid: str):
    course_list = course_dao.get_all(uid)
    if course_list is None:
        raise HTTPException(status_code=404, detail=f"User id {uid} does not exist to get courses")
    return course_list


@router.put("/{uid}/{course_id}", 
            response_model=Course, dependencies=[Depends(JWTBearer)],
            description="Update a specific users course by specifying the user by their uid and their \
                associated course by their course_id" 
            )
def update_course(uid: str, course_id: str, course: Course = Body(...)):
    parser = Parser()
    parser.write_ics(course)
    # print(parser.course)
    course.ics_file = parser.course.ics_file
    print(course.ics_file)

    course = course_dao.update(uid, course_id, course)
    if not course:
        raise HTTPException(status_code=404, detail="Invalid user id or course id")
    return course


@router.delete("/{uid}/{course_id}",
                description="Delete a specific users course by specifying their uid and their respective course_id" 
               )
def delete_course(uid: str, course_id: str):
    course_dao.delete(uid, course_id)

    return f"Deleted course {course_id} from user {uid}"
