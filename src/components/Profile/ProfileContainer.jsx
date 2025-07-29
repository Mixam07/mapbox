import { connect } from "react-redux";
import Profile from "./Profile";
import { getCelebretiesThunkCreator } from "../../redux/reducers/celebreties-reducer";

const mapStateToProps = (state) => {
    return{
        celebreties: state.celebreties.celebreties,
    }
}

export default connect(mapStateToProps, {
    getCelebreties: getCelebretiesThunkCreator
})(Profile);