<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Point extends Model {
    use HasFactory;
    
    protected $fillable = [
    'user_id',
    'points',
    'action_type',
];

    public function user(): BelongsTo
{
    // The Point table has a 'user_id' column
    return $this->belongsTo(User::class);
}
}