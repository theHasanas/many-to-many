const { Course, Student, College } = require("../../db/models");

//fetching
exports.fetchCourse = async (courseId, next) => {
  try {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: Student,
          as: "students",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
        {
          model: College,
          as: "college",
        },
      ],
    });
    return course;
  } catch (error) {
    next(error);
  }
};

// get course list

exports.courseList = async (request, response, next) => {
  try {
    const course = await Course.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Student,
          as: "students",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    response.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

// create course
// exports.courseCreate = async (request, response, next) => {
//   try {
//     // request.body.collegeId = request.college.id;

//     const newCourse = await Course.create(request.body);
//     response.status(201).json(newCourse);
//   } catch (error) {
//     next(error);
//   }
// };

// create course

exports.courseCreate = async (request, response, next) => {
  try {
    const newCourse = await Course.create(request.body);

    response.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

//update course

exports.courseUpdate = async (request, response, next) => {
  try {
    await request.course.update(request.body);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
};

//delete course

exports.courseDelete = async (request, response, next) => {
  try {
    await request.course.destroy();
    response.status(204).end();
  } catch (error) {
    next(error);
  }
};

// optionally decide if array or not
exports.addStudents = async (req, res, next) => {
  try {
    const students = await Student.findAll({
      where: { id: req.body.studentIds },
    });

    req.course.addStudents(students);

    res.status(200);
  } catch (error) {
    next(error);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    res.json(req.course.students);
  } catch (error) {
    next(error);
  }
};
