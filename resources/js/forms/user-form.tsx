// resources/js/Pages/Users/UserForm.tsx

import React from 'react';
import { useForm } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; // Assuming you have a Label component

// Define the type for the user data you might receive for editing
export type UserType = {
    id: string;
    name: string;
    email: string;
    // Add other fields you want to manage, e.g., role_id
}

// Define the props for the UserForm component
interface UserFormProps extends PageProps {
    user?: UserType; // Optional user object for editing
    // If you manage roles, you'd pass a roles array here: roles: RoleOption[];
}


export default function UserForm({ user }: UserFormProps) {
    // 1. Initialize Inertia form state
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '', // Include password for creation or optional update
        password_confirmation: '',
        // Add other fields here (e.g., role_id: user?.role_id ?? 1)
    });

    const isUpdating = !!user;

    // 2. Define the form submission handler
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Determine which route and method to use
        if (isUpdating) {
            // Note: Patch is often preferred for updates, but put is fine too
            put(route('users.update', user.id));
        } else {
            post(route('users.store'));
        }
    };

    return (
        <div className="max-w-3xl min-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">
                {isUpdating ? `Edit User: ${user.name}` : 'Create New User'}
            </h2>

            <form onSubmit={submit} className="space-y-6">

                {/* Name Field */}
                <div>
                    <Label htmlFor="name" className='mb-1'>Name **</Label>
                    <Input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                    <Label htmlFor="email" className='mb-1'>Email **</Label>
                    <Input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password Field (Required for Create, Optional for Update) */}
                <div>
                    <Label htmlFor="password" className='mb-1'>Password {isUpdating ? '(Leave blank to keep current)' : '**'}</Label>
                    <Input
                        type="password"
                        id="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required={!isUpdating} // Only required if creating
                        className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* Password Confirmation Field */}
                <div>
                    <Label htmlFor="password_confirmation" className='mb-1'>Confirm Password {isUpdating ? '' : '**'}</Label>
                    <Input
                        type="password"
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required={!isUpdating}
                    />
                    {/* Laravel handles the confirmation error usually via the 'password' field error */}
                </div>


                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full"
                >
                    {processing ? 'Saving...' : isUpdating ? 'Update User' : 'Create User'}
                </Button>
            </form>
        </div>
    );
}