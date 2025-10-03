const { where } = require('sequelize');
const Student = require('../model/student.model');

class StudentService
{
    async getAllStudents()
    {
        try
        {
            const result = await Student.findAll(
            );
            if(result.status == 200 && result.msg == 'sucess')
            console.log("Get all students data",{result});
        return result;
        }
        catch(error)
        {
            console.log("something happen in getallstudents service",error);
        }
        
    }
    async addNewStudents( studentData )
    {

        try
        {
            const data = studentData;
            const result = await  Student.create(data);
            console.log("Successfully added new student:", result.toJSON());
            return result;
        }
        catch(error)
        {
            console.log("creating some issue while addnew student",{error});
            throw  error;
        }
    }
    async dltAllStudent()
    {
    try{ 
        const result =await Student.destroy(
            {
                where:{},
                truncate: true,
            }
        );
        console.log("delete all student records");
        return result;
        }
        catch(error)
        {
            console.log("something issue while dlt all student in service",{error});
            throw error;
        }
    }
    async UpdateStudents(data,id)
    {
        try
        {
            console.log("calling update student service");
                const result = await Student.update(
                {
                    Name: data.Name,     
                    Mark: data.Mark,     
                    Active: data.Active  
                },
                {
                    where: { Id: id }    
                }
                );
                if ( result[0] === 0 )
                {
                    return {success : false, message:'no student present this id'}
                }
                return {success: true,message: "successfully updated"};
        }
        catch(error)
        {
            console.log("something issue on update student service",{error});
            throw error;
        }
    }
    async DltStudentById(id)
    {
        console.log("calling that dltstudentsbyId service");
        const Id = id;
        try
        {
            const result = await Student.destroy(
               { where: {Id : Id},}
            )
            if ( result === 0 )
                {
                    return {success : false, message:'no student present this id'}
                }
                console.log("successfully updated");
            return {success: true,message: "successfully updated"};
        }
        catch(error)
        {
            console.log("something issue on dlt students by id on service",{error});
            throw error
        }
    }
};

module.exports = new StudentService();