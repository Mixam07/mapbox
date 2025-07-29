import { connect } from "react-redux";
import Filter from "./Filter";
import { delCityList, delCountryList, selectAll, setActiveFilterItem, setCityInput, setCityList, setCountryInput, setCountryList, setPoints } from "../../../redux/reducers/celebreties-reducer";

const mapStateToProps = (state) => {
    return{
        celebreties: state.celebreties.celebreties,
        countryInput: state.celebreties.countryInput,
        cityInput: state.celebreties.cityInput,
        countryList: state.celebreties.countryList,
        cityList: state.celebreties.cityList,
        filterList: state.celebreties.filterList
    }
}

export default connect(mapStateToProps, {
    setPoints, setCountryInput, setCityInput, setCountryList, setCityList, delCountryList, delCityList, selectAll, setActiveFilterItem
})(Filter);