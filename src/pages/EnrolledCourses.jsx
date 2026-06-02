import CourseCard from "../components/CourseCard";
import "../styles/enrolled-courses.css";

export default function EnrolledCourses() {
  return (
    <div className="enrolled-courses">
      <div className="header">
        <div className="title m-t-32">
          <h1>Enrolled Courses</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam.
          </p>
        </div>
      </div>
      <div className="m-t-64">
        <h2 className="m-b-16">Qualifications</h2>
        <CourseCard />
      </div>

      <div className="col-2 gap-32 m-t-64">
        <div>
          <h2 className="m-b-16">Short Courses</h2>
          <CourseCard />
        </div>
        <div>
          <h2 className="m-b-16">Mini-MBA</h2>
          <CourseCard />
        </div>
      </div>
    </div>
  );
}
