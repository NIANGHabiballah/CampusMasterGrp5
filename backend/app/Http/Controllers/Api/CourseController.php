<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with('teacher')->get();
        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'semester' => 'required|string',
            'credits' => 'required|integer|min:1'
        ]);

        $course = Course::create([
            'title' => $request->title,
            'description' => $request->description,
            'teacher_id' => $request->user()->id,
            'semester' => $request->semester,
            'credits' => $request->credits
        ]);

        return response()->json($course->load('teacher'), 201);
    }

    public function show($id)
    {
        $course = Course::with(['teacher', 'assignments'])->findOrFail($id);
        return response()->json($course);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'semester' => 'sometimes|string',
            'credits' => 'sometimes|integer|min:1'
        ]);

        $course->update($request->only(['title', 'description', 'semester', 'credits']));

        return response()->json($course->load('teacher'));
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    }
}