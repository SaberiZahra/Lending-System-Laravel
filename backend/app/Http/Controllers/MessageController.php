<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Auth; //if you want to use auth()->user() instead of  $request->user()

class MessageController extends Controller
{
    public function conversations(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $conversations = Conversation::with([
                'participants:id,full_name,username,profile_image',
                'messages' => function ($q) {
                    $q->latest()->limit(1);
                }
            ])->get();
        } else {
            $conversations = Conversation::whereHas('participants', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->with([
                'participants:id,full_name,username,profile_image',
                'messages' => function ($q) {
                    $q->latest()->limit(1);
                }
            ])->get();
        }

        return response()->json($conversations);
    }

    public function messages(Conversation $conversation, Request $request)
    {
        $user = $request->user();

        if (
            !$user->isAdmin() &&
            !$conversation->participants()->where('user_id', $user->id)->exists()
        ) {
            return response()->json(['message' => 'Not allowed'], 403);
        }

        $messages = $conversation->messages()
            ->with('sender:id,full_name,username,profile_image')
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function send(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'message_text' => 'required|string',
        ]);

        $conversation = Conversation::findOrFail($request->conversation_id);
        $user = $request->user();

        if (
            !$user->isAdmin() &&
            !$conversation->participants()->where('user_id', $user->id)->exists()
        ) {
            return response()->json(['message' => 'Not allowed'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'message_text' => $request->message_text,
        ]);

        return response()->json($message->load('sender'), 201);
    }
}
