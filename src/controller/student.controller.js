const StudentService = require('../service/student.service');

class StudentController
{
    async getAllStudents(req,res)
    {
        try
        {
            console.log("calling getall students endpoint");
            const result = await StudentService.getAllStudents();
            console.log("getting student records with",{result});
            return res.status(200).json(result);  
        }
        catch(error)
        {
            console.log('something issue on getallstudents api',error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }     
    }

    async addNewStudent(req,res)
    {
        
        try
        {
            const data = req.body;
            if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "No data present. Check student payload." });
            }
            if(!data.Name)
            {
               return  res.status(400).json({message: 'missing that name field in add new student'});
            }
            if(!data.Mark)
            {
               return  res.status(400).json({message: 'missing that name field in add new student'});
            }
            const result = await StudentService.addNewStudents(data);
            return res.status(200).json(result);
            
        }
        catch(error)
        {
            console.log("somethign issue in addnew student controlller",{error});
            return res.status(500).json(error);
        }
    }  

    async DeleteStudents(req,res)
    {

        try
        {
        console.log("Calling that Delete All Student Api");
        const result = StudentService.dltAllStudent();
        return res.status(200).json(result);
        }
        catch(error)
        {
            console.log("something issue in dltall student controller",{error});
            throw error;
        }
    }

    async UpdateStudents(req,res)
    {
        try
        {
        console.log("calling that UpdateStudents Api controller");
        const data = req.body;
        const id = req.params.id;
        if(!data || Object.keys(data).length === 0)
        {
            return res.status(400).json({message:"requires param missing for this update student controller"})
        }
        const result = await StudentService.UpdateStudents(data,id);
        if(!result.success)
        {
            return res.status(404).json({message:result.message,result})
        }
        return res.status(200).json({result,message:'updated successfully'});
        }
        catch(error)
        {
            console.log("something issue on updatestudent controller");
            throw error;
        }
    }

    async DltStudentById(req,res)
    {
        console.log("calling that dltstudentbyId ");
        try
        {
            const id = req.params.id;
            if(!id || Object.keys(id).length === 0)
            {
                console.log("Missing id in that param");
                return res.status(404).json({message:'missing that id params'});
            }
            const result = await StudentService.DltStudentById(id);
            if(!result.success)
                {
                    return res.status(404).json({message:result.message,result})
                }
                return res.status(200).json({result,message:'updated successfully'});
        }
        catch(error)
        {
            console.log("something happen in dlt student by id in student controller",{error});
            throw error;
        }
    }
}

module.exports = new StudentController();