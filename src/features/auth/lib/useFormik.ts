import { useFormik } from "formik";
import { authThunks } from "features/auth/model/auth.reducer";
import { BaseResponseType } from "common/types/common.types";
import { LoginParamsType } from "features/auth/api/auth.api";
import { useAppDispatch } from "common/hooks";

type FormikErrorType = Partial<Omit<LoginParamsType, "captcha">>;

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 3) {
        errors.password = "Must be 3 characters or more";
      }

      return errors;
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false
    },
    onSubmit: (values, formikHelpers) => {
      dispatch(authThunks.login(values))
        .unwrap()
        .catch((err: BaseResponseType) => {
          console.log(formik.errors.email);

          err.fieldsErrors?.forEach((fieldError) => {
            return formikHelpers.setFieldError(fieldError.field, fieldError.error);
          });
        });
    }
  });
  return {
    formik
  };
};
