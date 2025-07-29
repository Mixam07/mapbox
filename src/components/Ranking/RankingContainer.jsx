import { connect } from "react-redux";
import Ranking from "./Ranking";
import { getUsersThunkCreator } from "../../redux/reducers/users-reduser";

const mapStateToProps = (state) => {
    return{
        users: state.users.users,
    }
}

export default connect(mapStateToProps, {
    getUsersThunkCreator
})(Ranking);