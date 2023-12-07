import {
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
} from "@mui/material";
import React, { useEffect } from "react";
import TextInput from "../../../Component/Inputs/TextInput";
import { AlternateEmail, Visibility, VisibilityOff } from "@mui/icons-material";
import ControlledSelect from "../../../Component/Inputs/ControlledSelect";

const UserForm = ({ control, getValues, errors, edit, userType }) => {
  const [action, setAction] = React.useState("Enter");
  const [showPassword, setShowPassword] = React.useState("password");
  const [showConfirmPassword, setShowConfirmPassword] = React.useState("password");
  const [role, setRole] = React.useState(userType);

  useEffect(() => {
    if (edit) {
      setAction("Edit");
    }

    // cleanup function
    return () => {
      setAction("Enter");
      setRole(userType);
      setShowPassword("password");
      setShowConfirmPassword("password");
    };
  }, [edit, userType]);

  const passwordDisplay = () => {
    showPassword === "text" ? setShowPassword("password") : setShowPassword("text");
  };

  const confirmPasswordDisplay = () => {
    showConfirmPassword === "text"
      ? setShowConfirmPassword("password")
      : setShowConfirmPassword("text");
  };

  return (
    <>
      {/* ------------------- NAME ------------------------- */}
      <Grid item xs={12} sm={6}>
        <InputLabel
          htmlFor="name"
          variant="standard"
          required
          sx={{
            mb: 1.5,
            color: "text.primary",
            "& span": { color: "error.light" },
          }}
        >
          {action} Your Name
        </InputLabel>
        <TextInput
          control={control}
          required
          maxLength={30}
          name="name"
          placeholder="John Doe"
          id="name"
          fullWidth
          autoComplete="family-name"
          error={errors.name ? true : false}
          helperText={errors.name && "Name is required"}
        />
      </Grid>

      {/* ------------------- EMAIL ------------------------- */}
      <Grid item xs={12} sm={6}>
        <InputLabel
          htmlFor="email"
          variant="standard"
          required={action === "Enter" ? true : false}
          sx={{
            mb: 1.5,
            color: "text.primary",
            "& span": { color: "error.light" },
          }}
        >
          {action} Email
        </InputLabel>
        <TextInput
          required={action === "Enter" ? true : false}
          control={control}
          pattern={/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/}
          name="email"
          id="email"
          placeholder="janedoe@gmail.com"
          fullWidth
          autoComplete="email"
          error={errors.email ? true : false}
          helperText={errors.email && "Invalid email address"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AlternateEmail />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* ------------------- PASSWORD ------------------------- */}
      <Grid item xs={12} sm={6}>
        <InputLabel
          htmlFor="password"
          variant="standard"
          required={action === "Edit" ? false : true}
          sx={{
            mb: 1.5,
            color: "text.primary",
            "& span": { color: "error.light" },
          }}
        >
          {action} Password
        </InputLabel>

        <TextInput
          control={control}
          required={action === "Edit" ? false : true}
          minLength={8}
          id="password"
          name="password"
          type={showPassword}
          fullWidth
          autoComplete="password"
          placeholder="••••••••••"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={passwordDisplay}
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  {showPassword === "password" ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={errors.password ? true : false}
          helperText={
            errors.password && "Password must be at least 8 characters long"
          }
        />
      </Grid>

      {/* ------------------- CONFIRM PASSWORD ------------------------- */}
      <Grid item xs={12} sm={6}>
        <InputLabel
          htmlFor="confirmPassword"
          variant="standard"
          required={action === "Edit" ? false : true}
          sx={{
            mb: 1.5,
            color: "text.primary",
            "& span": { color: "error.light" },
          }}
        >
          Confirm Password
        </InputLabel>

        <TextInput
          control={control}
          required={action === "Edit" ? false : true}
          validate={(value) => value === getValues("password")}
          id="confirmPassword"
          name="confirmPassword"
          fullWidth
          autoComplete="confirmPassword"
          type={showConfirmPassword}
          placeholder="••••••••••"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={confirmPasswordDisplay}
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  {showConfirmPassword === "password" ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={errors.confirmPassword ? true : false}
          helperText={
            errors.confirmPassword && "Password and confirm password must match"
          }
        />
      </Grid>

      {/* ------------------------------ USER ROLE ---------------------*/}
      {edit && (
        <Grid item xs={12}>
          <InputLabel
            htmlFor="userType"
            variant="standard"
            required
            sx={{
              mb: 1.5,
              color: "text.primary",
              "& span": { color: "error.light" },
            }}
          >
            User Role
          </InputLabel>
          <ControlledSelect
            control={control}
            required
            name="userType"
            id="userType"
            autoComplete="userType"
            defaultValue={role}
            fullWidth
          >
            <MenuItem
              value={"user"}
              onClick={() => {
                setRole("user");
              }}
            >
              User
            </MenuItem>

            <MenuItem
              value={"admin"}
              selected
              onClick={() => {
                setRole("admin");
              }}
            >
              Admin
            </MenuItem>
          </ControlledSelect>
        </Grid>
      )}
    </>
  );
};

export default UserForm;
