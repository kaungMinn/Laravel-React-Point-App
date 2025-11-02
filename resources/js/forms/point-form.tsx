
// resources/js/Pages/Points/Create.tsx

import React from 'react';
import { useForm } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export type PointType = {
    id: string;
    user_id: string;
    points: number;
    action_type: string
}

// Define types for the users list passed from the controller
interface UserOption {
    id: number;
    name: string;
}

interface PointsCreateProps extends PageProps {
    users: UserOption[];
    defaultActionType?: string;
    point?: PointType
}



export default function PointForm({ users, defaultActionType = "Manual Award", point }: PointsCreateProps) {
    // 1. Initialize Inertia form state
    const { data, setData, post, put, processing, errors } = useForm({
        user_id: String(point?.user_id ?? users[0]?.id ?? ''),
        points: point?.points ?? 0,
        action_type: point?.action_type ?? defaultActionType,
    });

    const isUpdating = !!point;

    // 2. Define the form submission handler
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Submit data to the points.store Laravel route
        if (isUpdating) {
            put(route('points.update', point.id), { invalidateCacheTags: ['/leaderboard', '/points', '/users'] })
        } else {
            post(route('points.store'), { invalidateCacheTags: ['/leaderboard', '/points', '/users'] });
        }
    };




    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">{isUpdating ? 'Edit Points Manually' : 'Award Points Manually'}</h2>

            <form onSubmit={submit} className="space-y-6">
                {/* User Selection Field */}
                <div>
                    <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">Select User **</label>
                    <Select
                        // Use the string value from form data
                        value={String(data.user_id)}
                        // The onChange handler r eceives the new VALUE directly as a string
                        onValueChange={(value) => setData('user_id', value)}
                        required
                    >
                        <SelectTrigger id="user_id" className={errors.user_id ? 'border-red-500' : ''}>
                            {/* SelectValue displays the selected item's text */}
                            <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Users</SelectLabel>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.user_id && <p className="mt-2 text-sm text-red-600">{errors.user_id}</p>}
                </div>

                {/* Points Field */}
                <div>
                    <label htmlFor="points" className="block text-sm font-medium text-gray-700">Points to Award **</label>
                    <Input
                        type="number"
                        id="points"
                        value={data.points}
                        onChange={(e) => setData('points', parseInt(e.target.value))}
                        min="1"
                        required
                    />
                    {errors.points && <p className="mt-2 text-sm text-red-600">{errors.points}</p>}
                </div>

                {/* Action Type Field */}
                <div>
                    <label htmlFor="action_type" className="block text-sm font-medium text-gray-700">Action Type/Reason **</label>
                    <Input
                        type="text"
                        id="action_type"
                        value={data.action_type}
                        onChange={(e) => setData('action_type', e.target.value)}
                        required
                    />
                    {errors.action_type && <p className="mt-2 text-sm text-red-600">{errors.action_type}</p>}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={processing}
                >
                    {processing ? 'Saving...' : isUpdating ? 'Update Points' : 'Award Points'}
                </Button>
            </form>
        </div>
    );
}