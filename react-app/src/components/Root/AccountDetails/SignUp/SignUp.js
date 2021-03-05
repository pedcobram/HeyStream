import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";

import TextInput from "#root/components/shared/TextInput";

const Label = styled.label`
  display: block;
  :not(:first-child) {
    margin-top: 0.75rem;
  }
`;

const LabelText = styled.strong`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const SignUpButton = styled.button`
  display: inline-block;
  margin-top: 0.5rem;
`;

const OrSignUp = styled.span`
  font-size: 0.9rem;
`;

const mutation = gql`
  mutation($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      id
    }
  }
`;

const validationSchema = yup.object().shape({
  email: yup.string().required(),
  password: yup
    .string()
    .required()
    .test("sameAsConfirmPassword", "${path} is not the same as the confirmation password", function(item) {
      console.log(this.parent.password)
      console.log("eyyy")
      return (this.parent.password === this.parent.confirmPassword)
      
    })
});

const SignUp = ({ onChangeToLogin: pushChangeToLogin }) => {
  const {
    formState: { isSubmitting, isValid },
    handleSubmit,
    register,
    reset,
    watch,
    errors
  } = useForm({ mode: "onChange", validationSchema });
  const [createUser] = useMutation(mutation);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    await createUser({ variables: { email, password } });
    reset();
    pushChangeToLogin();
  });

  const style = {
    width: "15rem"
  }

  const password = useRef({});
  password.current = watch("password", "");

  return (
    <div style={style}>
      <form onSubmit={onSubmit}>
        <Label>
          <LabelText className="input-group-text">Email</LabelText>
          <TextInput className="form-control mr-sm-2" disabled={isSubmitting} name="email" type="email" ref={register} />
        </Label>
        <Label>
          <LabelText className="input-group-text">Password</LabelText>
          <TextInput className="form-control mr-sm-2" disabled={isSubmitting} name="password" type="password" ref={register} />
        </Label>
        <Label>
          <LabelText className="input-group-text">Confirm Password</LabelText>
          <TextInput className="form-control mr-sm-2" disabled={isSubmitting} name="confirmPassword" type="password" ref={register({
            validate: value => value === password.current || "Passwords do not match"})} 
          />
          
          {errors.confirmPassword.type}
        </Label>
        <SignUpButton className="btn btn-primary my-2 my-sm-0" disabled={isSubmitting || !isValid} type="submit" onSubmit={onSubmit}>
          Sign Up
        </SignUpButton>{" "}
        <OrSignUp>
          or{" "}
          <a className="btn btn-secondary"
            href="#"
            onClick={evt => {
              evt.preventDefault();
              pushChangeToLogin();
            }}
          >
            Login
          </a>
        </OrSignUp>
      </form>
    </div>
  );
};

export default SignUp;