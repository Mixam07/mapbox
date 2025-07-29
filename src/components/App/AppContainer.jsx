import { connect } from "react-redux";
import { getCelebretiesThunkCreator } from "../../redux/reducers/celebreties-reducer";
import App from "./App";

const mapStateToProps = (state) => {
    return{
    }
}

export default connect(mapStateToProps, {
    getCelebretiesThunkCreator
})(App);