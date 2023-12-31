"use client";
import { Input, InputGeneratedByForm } from "../components/Input";
import Link from "next/link";
import { FormProps } from "../../@types/form";
import { Select, SelectGeneratedByForm } from "../components/Select";
import { TextArea, TextAreaGeneratedByForm } from "../components/TextArea";
import { useRouter } from "next/navigation";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import React from "react";

type Form = Omit<FormProps, "redirectFunction">;

export default function Form<T extends FieldValues>({
  data,
  children,
  goal,
  title,
  submitURL,
  className = "",
  mistakeInstruction = "",
  isSimpleForm = false,
  extraData,
  successRedirectionURL,
  removeRequestProps = [],
}: Form) {
  if ((!children && !data) || (children && data)) {
    throw new Error(
      'Either "children" components or "data" prop must be provided, but not both.'
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<T>();

  const router = useRouter();

  const onSubmit: SubmitHandler<T> = async (data: { [x: string]: any }) => {
    if (removeRequestProps && removeRequestProps.length !== 0) {
      removeRequestProps.forEach((prop) => delete data[prop]);
    }

    const response = await fetch(submitURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Strict-Transport-Security":
          "max-age=31536000; includeSubDomains; preload",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "X-XSS-Protection": "1; mode=block",
      },
      body: extraData
        ? JSON.stringify(Object.assign(data, { ...extraData }))
        : JSON.stringify(data),
      credentials: "same-origin",
    });

    const responseBody = await response.json();

    if (responseBody.status === 200 && successRedirectionURL) {
      router.push(successRedirectionURL);
    }
  };

  const inputNames: Set<string> = new Set();

  return (
    <div
      className={`w-full p-8 sm:p-12 bg-slate-100 dark:bg-slate-900/40 sm:w-9/12 md:w-7/12 lg:w-5/12 ${className} ${
        isSimpleForm ? "w-full p-0 bg-inherit" : ""
      }`}
    >
      {isSimpleForm ? (
        ""
      ) : (
        <h1 className="text-xl font-semibold">
          Hello there ?,{" "}
          <span className="font-normal">
            {goal === "register"
              ? "please fill in your information to register"
              : goal === "login"
              ? "please fill in your information to login"
              : title}
          </span>
        </h1>
      )}
      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-between gap-3">
          {data
            ? data.map((input, index) => {
                const { name } = input;
                if (inputNames.has(name)) {
                  throw new Error(
                    `Two Form Fields cannot share a same name!! (${name})`
                  );
                }
                inputNames.add(name);

                return (
                  <div key={`${input.name}-${index}`}>
                    {input.element !== undefined &&
                    input.element === "select" ? (
                      <SelectGeneratedByForm {...input} register={register} />
                    ) : input.element !== undefined &&
                      input.element === "textarea" ? (
                      <TextAreaGeneratedByForm {...input} register={register} />
                    ) : (
                      <InputGeneratedByForm
                        {...input}
                        register={register}
                        getValues={getValues}
                      />
                    )}
                    {errors[name]?.message && (
                      <span className="text-sm text-red-500">
                        {`${errors[name]?.message}`}
                      </span>
                    )}
                  </div>
                );
              })
            : React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                  const { name } = child.props;
                  if (inputNames.has(name)) {
                    throw new Error(
                      `Two Form Fields cannot share a same name!! (${name})`
                    );
                  }
                  inputNames.add(name);

                  let componentToReturn;

                  if (child.type === Input) {
                    componentToReturn = (
                      <InputGeneratedByForm
                        {...child.props}
                        register={register}
                        getValues={getValues}
                      />
                    );
                  } else if (child.type === Select) {
                    componentToReturn = (
                      <SelectGeneratedByForm
                        {...child.props}
                        register={register}
                      />
                    );
                  } else if (child.type === TextArea) {
                    componentToReturn = (
                      <TextAreaGeneratedByForm
                        {...child.props}
                        register={register}
                      />
                    );
                  }
                  return (
                    <div key={`${child.props.name}.${index}`}>
                      {componentToReturn}
                      {errors[name]?.message && (
                        <span className="text-sm text-red-500">
                          {`${errors[name]?.message}`}
                        </span>
                      )}
                    </div>
                  );
                }
                return child;
              })}
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-indigo-900 shadow-lg focus:outline-none hover:bg-indigo-800 hover:shadow-none"
        >
          {goal === "register"
            ? "Sign Up"
            : goal === "login"
            ? "Sign In"
            : "Submit"}
        </button>
        <p className="inline-block mt-4 text-xs text-gray-500 cursor-pointer dark:hover:text-white hover:text-black">
          {goal === "register" ? (
            <Link href={"/login"}>Already registered? Login</Link>
          ) : goal === "login" ? (
            <Link href={"/register"}>Not Registered? Join Us</Link>
          ) : typeof mistakeInstruction === "object" ? (
            <Link href={mistakeInstruction[0]}>
              {mistakeInstruction[1] ? mistakeInstruction[1] : ""}
            </Link>
          ) : (
            <Link href={"/"}>
              {mistakeInstruction ? mistakeInstruction : ""}
            </Link>
          )}
        </p>
      </form>
    </div>
  );
}
