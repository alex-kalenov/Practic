<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;

class EmployeesController extends Controller
{
    public function index()
    {
        return Employee::all();
    }
 
    public function store(Request $request)
    {
        $employee = Employee::create($request->all());
 
        return response()->json($employee);
    }
 
    public function delete($id)
    {
    	$employee = Employee::findOrFail($id);
        if($employee)
           $employee->delete(); 
        else
            return response()->json(error);
        return response()->json($employee);
    }
}
