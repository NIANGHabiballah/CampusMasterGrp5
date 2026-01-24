<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $messages = Message::where('receiver_id', $request->user()->id)
            ->orWhere('sender_id', $request->user()->id)
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'content' => 'required|string'
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'subject' => $request->subject,
            'content' => $request->content
        ]);

        return response()->json($message->load(['sender', 'receiver']), 201);
    }

    public function show($id)
    {
        $message = Message::with(['sender', 'receiver'])->findOrFail($id);
        
        // Mark as read if user is receiver
        if ($message->receiver_id === auth()->id()) {
            $message->update(['is_read' => true]);
        }
        
        return response()->json($message);
    }

    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $message->delete();
        return response()->json(['message' => 'Message deleted successfully']);
    }
}