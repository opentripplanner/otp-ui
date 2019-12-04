import { useSelector, useDispatch } from "react-redux";
import { LIGHT_THEME, DARK_THEME } from "./constants";

const useTheme = () => {
  const themeName = useSelector(s => s.user.theme.name);
  const dispatch = useDispatch();
  const updateTheme = () =>
    dispatch({
      type: "SET_THEME",
      payload: themeName === LIGHT_THEME.name ? DARK_THEME : LIGHT_THEME
    });

  return {
    updateTheme
  };
};

export default useTheme;
