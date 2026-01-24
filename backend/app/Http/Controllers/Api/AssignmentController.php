<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Assignment::with(['course']);
        
        if ($request->has('course')) {
            $query->where('course_id', $request->course);
        }
        
        $assignments = $query->get();
        return response()->json($assignments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date',
            'max_points' => 'required|integer|min:1'
        ]);

        $assignment = Assignment::create($request->all());
        return response()->json($assignment->load('course'), 201);
    }

    public function show($id)
    {
        $assignment = Assignment::with(['course', 'submissions'])->findOrFail($id);
        return response()->json($assignment);
    }

    public function update(Request $request, $id)
    {
        $assignment = Assignment::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'due_date' => 'sometimes|date',
            'max_points' => 'sometimes|integer|min:1'
        ]);

        $assignment->update($request->all());
        return response()->json($assignment->load('course'));
    }

    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);
        $assignment->delete();
        return response()->json(['message' => 'Assignment deleted successfully']);
    }

    public function submit(Request $request, $id)
    {
        // Placeholder for assignment submission
        return response()->json(['message' => 'Assignment submitted successfully']);
    }
}