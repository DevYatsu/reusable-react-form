# ReusableReactFormComponent
This repository contains a reusable form component built with React Hook Form and Tailwind CSS. 
The form component provides an easy and efficient way to handle form validation, user input, and form submission in React applications.

## Features
- Utilizes React Hook Form for form validation and state management.
* Integrates Tailwind CSS for styling and responsive design.
+ Supports various input types, such as text, email, password, etc.
- Customizable form fields with validation rules.
* Easy integration with existing React projects.
+ Lightweight and performant.

## Installation

There are actually two ways to use our Form Component, either use the data property of the component or insert Input, Select and TextArea components as children of the Form Component. We will first cover the data prop method then the children components method.
To use the form component in your project, follow these steps:

## 1. Install **reusable-react-hook** library:
- `npm install reusable-react-hook` 
- `pnpm install reusable-react-hook`
- `yarn add reusable-react-hook`

## 2. Import the form component into your React application:

```typescript
import { Form } from 'reusable-react-form/lib';
//import { NextForm as Form } from 'reusable-react-form/lib'; if using nextjs

function App() {
  return (
    <div className="App">
    </div>
  );
}
```

## 3. How does the component work ?

Keep in mind that the component needs at least two parameters to work, these parameters are:
- data: an array of objects defining which components should the form contain
- submitURL: a string of the url to POST the data on when user submits the form

```typescript

const data = 
  [
    {element: "input", name:"test", placeholder: "enter sth"} 
    // each object represents either an input, a select or a textarea
  ];

```

## 4. Add the minimal parameters for the Form to works correctly

The name property in objects contained in the data array must be written in CamelCase.

```typescript
import { Form } from 'reusable-react-form/lib';

const data = [
{
  name: "inputName", // in CamelCase
  placeholder: "Enter something...",
}
];
//data is an array of all the input (represented by objects), textarea and select components

function App() {
  return (
    <div className="App">
      <Form 
          data={data} 
            //represents the informations on the different elements in the form
   
          submitURL="/api/urlToPostOn" 
             // the url the data entered in the form will be posted to
      />
    </div>
  );
}
```
These are the minimum requirements for the Form to work correctly.
The form will be composed of one input with the name and placeholder put in the data array.

You can check all the possbile arguments attributable to the form component in the types/form.ts file even tough we will see most of them in the next sections.

## 5. Customize the form fields and validation rules according to your requirements.

We can take a look at the possibilities regarding the customization of the form fields:

```typescript
import { Form } from 'reusable-react-form/lib';

const data = [
{
  // the form will check if the input possessess a label key
  // if it does it will be used as label, elsewhere the name
  // will be used, set it in camelCase in case
  name: "familyName", 
  label: "family name",
  placeholder: "Enter something...",
  type: "password", //all possible input types, default is obviously set to "text" 
  minLength: 6, //set a min length
  maxLength: {
    value: 34, //set a max length
    message: "Password cannot exceed 34 characters long" 
    //error message displayed when maxLength is not respected, you can do the same with minLength
  },
  required: true
},
{
  name: "inputName2", // name must be unique
  placeholder: "Enter something...",
  type: "number",
  min: {
    value: 0,
    message: "Number must be positive"
  },
  required: "number is required" 
   //same as required: true, here is a way to directly set the error message
}, 
{
  element: "select",
  name: "pickAFlavour", // name of the select (unique as well)
  values: [ // the options of the select
    {value: "1", displayValue: "chocolate"}, 
     //option with type {value: string; displayValue: string;}
    {value: "2", displayValue: "vanilla"}
  ]
}, 
{
  element: "textarea",
  name: "PostAComment",
  placeholder: "enter a comment...",
  required: true,
}, 
{//when element prop is not explicitly set to "textarea" or "select", element is an input
  name: "passwordConfirm",
  type: "password", 
  isPasswordConfirm: true 
//boolean useful in this case only to ensure the password and passwordConfirm inputs have the same value
//it will compare this input with the input NAMED "password" and only this one
} 
];

function App() {
  return (
    <div className="App">
      <Form 
          data={data} 
          submitURL="/api/urlToPostOn" 
      />
    </div>
  );
}
```

In this code are covered most of the possibilities regarding the customization of the elements composing the form.
We can now look at the customization of the parameters on the Form component.

## 6. Form Component Customization

```typescript
import { Form, genInput, genSelect, genTextArea } from 'reusable-react-form/lib';

const data = [//name       //placeholder
formInput("testInput", "Enter some text...", {//options in an object
   minLength: {
      value: 1,
      message: "min length is 1"
   }//you can also add form inputs like this
}),
formSelect("testSelect", 
[{value: "test", displayedValue:"hehe test"}, {value: "test2", displayedValue:"hehe test2"}]
),
formTextArea("testTextArea", "placeholder...", {rows: 5})
];             //name                          //options, row defaults to 6

function App() {
  return (
    <div className="App">
      <Form 
          data={data} // (FormInputProps | FormSelectProps | FormTextAreaProps)[] 
          // you can check all the props in the types/form.ts file, 
          // though most of them are in the example above
  
          submitURL="/api/urlToPostOn" // (string) 
  
          goal="register" // ("register" | "login" | undefined)
          //may be either "register"|"login", allows some automatic customization of the form
          // still I recommand to use one of them if the form is for one of these purposes
  
          title="My Form" // (string | undefined)
          // set a customized title, the goal param also sets a title when used
  
          className="pt-5 mb-2 bg-red-500 text-orange-600 etc." // (string | undefined) 
  
          isSimpleForm={true} // (boolean | undefined)
          // default set to false, not recommended except when using textarea alone

          mistakeInstruction={"Not Registered yet? Join Now"}
          //(string | [href: string; instruction: string] | undefined)
          // instruction set at the end of the form
          // when using the goal parameter, it is automatically set
          // otherwise it's value is "" except if you set it yourself
          //you can also set an url it will redirect to with an anchor onClick
          //this URL defaults to "/" 
  
          extraData={{postUser: "DevYatsu"}} // (Record<string, any> | undefined)
          // data that will be add to form data when POST request is made

          successRedirectionURL={"/"} // (string | undefined)
          //URL on which user has to be redirected on when data is sent and responded with a status 200
          //working on the nextJS version of the component with useRouter()
          //working on the main version with a redirecting function given as parameter (redirectFunction)

          removeRequestProps={["passwordConfirm"]}// (string[] | undefined)
          //an array of the element names that must be removed before posting the data
          //for example here passwordConfirm is removed, this way there is only the password that is sent 
          // and no passwordConfirm which may be useless

         redirectFunction={redirect} // ((string) => void)
         //a function called to redirect the user on another page
         //should take one parameter which is the url to redirect on
         //this parameter is to be set in the successRedirectionURL form parameter

         //only on the component not destined to be used on nextJS
         //can still be used on nextJS though but I do not recommand it
      />
    </div>
  );
}
```

## 7. Concrete example

Let's suppose we are building a register page on my website.

```typescript
import { Form } from 'reusable-react-form/lib';

const data = [
{
    name: "username",
    placeholder: "John",
    minLength: {
      value: 4,
      message: "Username must be at least 3 characters long",
    },
    maxLength: {
      value: 18,
      message: "Username cannot exceed 18 characters long",
    },
    pattern: {
      value: "^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$",
      message: "Invalid username.",
    },
    required: "Username is required",
  },
{name: "email", placeholder: "Your email...",
pattern: ... 
{
   name: "password", placeholder: "Your password...", type: "password", 
   minLength:...,
   maxLength: ...,
   pattern: ...
},
{name: "passwordConfirm", placeholder: "Your password again...", type: "password",
   minLength: ...,
   maxLength: ...,
   pattern: ...
   isPasswordConfirm: true
},
];

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
         <Form 
          data={data}
          submitURL="/api/register"
          goal="register"    
   
          successRedirectionURL={"/login"} 
         // do not forget to set it up if not using nextjs
   
          removeRequestProps={["passwordConfirm"]}
         />
      <main/>
    </div>
  );
}
```

It's done! As simple as that our component works perfectly!
But it is kind of painful to write the data object right ?
That's why I wrote in advance a few elements for you!

## 8. Making our forms even simpler!

Let's suppose we are building the same register page as before.
Instead of rewriting the components from earlier everytime we can simply use the components found with the form!
We can find basic but common components in this directory `./utils/formFunctions.ts`

```typescript
import { Form, getGenericFormInputsData, genInput } from 'reusable-react-form/lib';

const data = getGenericFormInputsData("username", "email", "password", "passwordCheck"); 
// in the right order we put the components names as parameters of this function.
// now the data variable contains the same array with object as before;
//actually these saved components are more secure and have more restrictions and validation rules

OR YOU CAN EVEN DO THAT
const data = 
   [
      ...getGenericFormInputsData("username", "email", "password", "passwordCheck"), 
      formInput("test", "enter sth")
   ];

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
         <Form 
          data={data}
          submitURL="/api/register"
          goal="register"    
          successRedirectionURL={"/login"} // do not forget to set it up if not using nextjs
          removeRequestProps={["passwordConfirm"]}
         />
      <main/>
    </div>
  );
}
```

Isn't it actually easy ?
We've come full circle! 
You have seen everything there is to seen in my simple project, have fun!

## 9. I haven't told you everything!
If you prepare using a more react-friendly approach, I have at last implemented an other way to use the Form component!

### The form component can be used in 2 distinct ways:
1. Using the data property of the form

All the examples up there cover this method, so i will be rather quick on this one. You just set an array of objects as value of the data parameter on the form, each object representing one form field, either an input, a select or a textarea. This method cannot be mixed with the other method.

2. Using the Input, Select and TextArea components

You can import 3 components that can be passed as children of the Form component and that represent the different fields of the form. The two methods are working in a similar way, we are just taking a different approach. The components can take as parameters the same parameters as if they were objects in the data array. Let's see an example real quick!

```typescript
import { Form, Input, Select, TextArea } from "reusable-react-form/lib";

export default function App() { 
  return <>
        <Form submitURL="/">
          {/*I would rather consider using the 1st method with the getGenericFormInputsData("email") because the validation regex is more complex and efficient*/}
            <Input name="email" placeholder="Enter your email..." type="email" pattern={{value: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message:"must be a valid email"}} /> 
            <Input name="username" placeholder="The way you want us to call you..." minLength={4}/>
            <TextArea name="survey" placeholder="How did you hear about us..." minLength={{value: 20, message: "please tell us a bit more about it"}}/>
            <Select name="gender" values=[{value: "male", displayValue: "male"}, {...}] />
            <Input name="password" placeholder="Enter your password..." type="password" minLength={{value:8, message: "password must contain at least 8 characters"}}/>
        </Form>
    </>
} 

```

The 2 methods cannot be mixed together. It means that you either decide to use the data array or the form children components. If you try to mix the two methods, it will produce an error. Use whichever you think is better for what you wish to achieve, may it be a complex form or just a simple form needing at most a username, email and password inputs.


## 10. Start using the lib:
Just a fresh reminder: 
- To install the package
  
``npm install reusable-react-form``

- To import the Form in a nextJS project
```typescript
import { NextForm as Form } from "reusable-react-form/lib";
```
- To import the Form in any other reactJS project
```typescript
import { Form } from "reusable-react-form/lib";
```
- To import form components
```typescript
import { Input, Select, TextArea } from "reusable-react-form/lib";
```
- To import third-party functions and utils
```typescript
import { getGenericFormInputsData, genInput, genSelect, genTextArea } from "reusable-react-form/lib";
```

Start using this simple form component and have fun!
