import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import "./App.css"; // Import external CSS

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("http://localhost:5000/signIn", data);
      alert(response.data.message);
    
    } catch (error:any) {
      console.log(error)
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Welcome back!</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <input {...register("email")} placeholder="UID" className="input" />
        {errors.email && <p className="error-text">{errors.email.message}</p>}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="input"
        />
        {errors.password && (
          <p className="error-text">{errors.password.message}</p>
        )}

        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
};

export default App;
