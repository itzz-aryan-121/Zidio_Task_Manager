import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import Register_Login from "./pages/Register_Login";
import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "./redux/slices/authSlice";
import { setLoading } from "./redux/slices/stateSlice";

function App() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const loading = useSelector((store) => store.state.loading);
	const token = localStorage.getItem("token");
	const getAuthUser = (token) => {
		dispatch(setLoading(true));
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(setLoading(false));
				if (json?.data) {
					dispatch(addAuth(json.data));
					navigate("/");
				} else {
					navigate("/login");
				}
			})
			.catch((err) => {
				console.log(err);
				dispatch(setLoading(false));
			});
	};

	useEffect(() => {
		if (token) {
			getAuthUser(token);
		} else {
			navigate("/login");
		}
	}, [token, pathname]);

	return (
		<div>
			{loading && <Loading />}
			<Suspense fallback={<Loading />}>
				<Routes>
					<Route
						path="/"
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route path="/login" element={<Register_Login />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</Suspense>
		</div>
	);
}

export default App;
