import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { getError } from '../utils/error';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password }) => {
    try {
      //will create a new user
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      //then log in user using sign in function
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Create Account">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-lg">Create Account</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register('name', {
              required: 'Please enter name.',
            })}
          />
          {/* {accepts two parameters  1)field name and 2)required validation} */}
          {errors.name && (
            <div className="text-red-600">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full"
            id="email"
            {...register('email', {
              required: 'Please enter the email.',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Enter valid email address.',
              },
            })}
          />
          {/* {accepts two parameters  1)field name and 2)required validation} */}
          {errors.email && (
            <div className="text-red-600">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="w-full"
            id="password"
            autoFocus
            {...register('password', {
              required: 'Please enter the password.',
              minLength: {
                value: 6,
                message: 'password should be more then 5 characters',
              },
            })}
          />
          {errors.password && (
            <div className="text-red-600">{errors.password.message}</div>
          )}
        </div>
        {/* //confirm password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            className="w-full"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please enter the confirm password.',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'password should be more then 5 characters',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-600">{errors.confirmPassword.message}</div>
          )}
        </div>

        {errors.confirmPassword &&
          errors.confirmPassword.type === 'validate' && (
            <div className="text-red-500 ">Password do not match</div>
          )}

        <div className="mb-4">
          <button className="primary-button">Register</button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account account?&nbsp;
          <Link legacyBehavior href={`/register?redirect=${redirect || '/'}`}>
            Register
          </Link>
        </div>
      </form>
    </Layout>
  );
}
