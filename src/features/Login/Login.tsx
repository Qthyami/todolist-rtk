import React from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { loginTC } from "features/Login/auth-reducer";
import { AppRootStateType } from "app/store";

export const Login = () => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn);

  const formik = useFormik({
    validate: (values) => {
      if (!values.email) {
        return {
          email: "Email is required"
        };
      }
      if (!values.password) {
        return {
          password: "Password is required"
        };
      }
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false
    },
    onSubmit: (values) => {
      dispatch(loginTC(values));
    }
  });

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{" "}
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
              {formik.errors.email ? <div>{formik.errors.email}</div> : null}
              <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps("password")} />
              {formik.errors.password ? <div>{formik.errors.password}</div> : null}
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox {...formik.getFieldProps("rememberMe")} checked={formik.values.rememberMe} />}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};

// import Grid from '@mui/material/Grid';
// import Checkbox from '@mui/material/Checkbox';
// import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormGroup from '@mui/material/FormGroup';
// import FormLabel from '@mui/material/FormLabel';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import {useFormik} from "formik";
//
// import { authThunks, loginTC } from "./auth-reducer";
// import {Navigate} from "react-router-dom";
// import { useSelector } from "react-redux";
// import { AppRootStateType } from "app/store";
// import { useAppDispatch } from "hooks/useAppDispatch";

// type FormikErrorType = {
//     email?: string
//     password?: string
//     rememberMe?: boolean
// }
// export const Login = () => {
//     const dispatch=useAppDispatch();
//     const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);
//     const formik = useFormik({
//         initialValues: {
//             email: '',
//             password: '',
//             rememberMe: false
//         },
//         validate: (values) => {
//             const errors: FormikErrorType = {}
//             if (!values.email) {
//                 errors.email = 'Required'
//             } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
//                 errors.email = 'Invalid email address'
//             }
//             if(!values.password){
//                 errors.password="Required"
//             } else if (values.password.length<5){
//                 errors.password="Should be more than five symbols"
//             }
//             return errors
//         },
//         onSubmit: (values, formikBag) => {
//             formikBag.setSubmitting(true); // Устанавливаем isSubmitting в true при начале отправки
//
//             dispatch(authThunks.loginTC(values))
//               .then(() => {
//                   // Успешно отправлено
//                   formikBag.setSubmitting(false); // Устанавливаем isSubmitting в false после успешной отправки
//                   formikBag.resetForm();
//               })
//               .catch((error) => {
//                   // Обработка ошибок при отправке
//                   formikBag.setSubmitting(false); // Устанавливаем isSubmitting в false при ошибке
//                   // Другая логика обработки ошибок, если необходимо
//               });
//         },
//     })
//
//     if(isLoggedIn){
//         return <Navigate to={"/"}/>
//     }
//
//     return <Grid container justifyContent={'center'}>
//         <Grid item justifyContent={'center'}>
//             <FormControl>
//                 <form onSubmit={formik.handleSubmit}>
//                     <FormLabel>
//                         <p>To log in get registered
//                             <a href={'https://social-network.samuraijs.com/'}
//                                target={'_blank'}> here
//                             </a>
//                         </p>
//                         <p>or use common test account credentials:</p>
//                         <p>Email: free@samuraijs.com</p>
//                         <p>Password: free</p>
//                     </FormLabel>
//                     <FormGroup>
//                         <TextField
//                           label="Email"
//                           margin="normal"
//                           name={"email"}
//                           onChange={formik.handleChange}
//                           value={formik.values.email}
//                           onBlur={formik.handleBlur}
//                           error={!!formik.errors.email}/>
//                         {formik.errors.email && formik.touched.password ? <div style={{color:"red"}}>{formik.errors.email}</div> : null}
//                         {/*formik.touched это свойство типо было тронуто это поле, чтобы загоралась ошибка только на том инпуте, где мы тронули и ошиблись*/}
//                         <TextField type="password" label="Password" name={"password"} onChange={formik.handleChange}  value={formik.values.password} onBlur={formik.handleBlur} error={!!formik.errors.password}
//                                    margin="normal"
//                         />
//                         {formik.errors.password && formik.touched.password ? <div style={{color:"red"}}>{formik.errors.password}</div> : null}
//                         <FormControlLabel label={'Remember me'} control={<Checkbox
//                           onChange={formik.handleChange}
//                           checked={formik.values.rememberMe}
//                           name="rememberMe"
//
//                         />}/>
//                         <Button disabled={formik.isSubmitting} type={'submit'} variant={'contained'} color={'primary'}>
//                             Login
//                         </Button>
//                     </FormGroup>
//                 </form>
//             </FormControl>
//         </Grid>
//     </Grid>
// }
