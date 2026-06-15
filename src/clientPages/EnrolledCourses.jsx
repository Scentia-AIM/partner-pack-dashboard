import CourseCard from "../components/CourseCard";
import "../styles/enrolled-courses.css";

export default function EnrolledCourses({
  currentContract,
  studentRecords,
  isLoadingStudents,
  studentError,
}) {
  const getCourseCountsByType = (students, courseType) => {
    return students
      .filter((student) => student.courseType === courseType)
      .reduce((counts, student) => {
        const courseName = student.courseName;

        counts[courseName] = (counts[courseName] || 0) + 1;

        return counts;
      }, {});
  };

  const qualificationCounts = getCourseCountsByType(
    studentRecords,
    "qualification",
  );

  const shortCourseCounts = getCourseCountsByType(
    studentRecords,
    "short_course",
  );

  const miniMbaCounts = getCourseCountsByType(studentRecords, "mini_mba");

  return (
    <div className="enrolled-courses">
      <div className="header">
        <div className="title m-t-32">
          <h1>Enrolled Courses</h1>
          <p>
            View the qualifications, short courses and Mini-MBA programs
            included in your partner pack. See enrolment numbers across each
            course and access course-level learner details.
          </p>
        </div>
      </div>

      <div className="m-t-64">
        <h2 className="m-b-16">Qualifications</h2>
        <CourseCard title="Qualifications" courses={qualificationCounts} />
      </div>

      <div className="col-2 gap-32 m-t-64">
        <div>
          <h2 className="m-b-16">Short Courses</h2>
          <CourseCard title="Short Courses" courses={shortCourseCounts} />
        </div>

        <div>
          <h2 className="m-b-16">Mini-MBA</h2>
          <CourseCard title="Mini-MBA" courses={miniMbaCounts} />
        </div>
      </div>
    </div>
  );
}
