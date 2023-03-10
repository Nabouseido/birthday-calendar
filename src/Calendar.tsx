import { useState, useEffect } from "react";
import dayjs, {Dayjs} from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
library.add(solidStar, regularStar);


interface Birthday {
  name: string;
  date: Dayjs;
}

function Calendar() {

    const [value, setValue] = useState(dayjs());
    const [birthdays, setBirthdays] = useState<Birthday[]>([]);
    const [favourites, setFavourites] = useState<Birthday[]>([]);

   // intialize birthday list with today's date on first render
    useEffect(() => {
        handleDateChange(dayjs());
    }, []);

    //called when the user selects the star icon to toggle the "favourite" state
    function handleFavouriteToggle(birthday: Birthday){
        if (favourites.includes(birthday)) {
            setFavourites(favourites.filter(favouriteItem => favouriteItem !== birthday));
        } else {
            setFavourites([...favourites, birthday]);
        }
    };

    //solid star icon is used to represent a "favourited" birthday
    function getIcon(birthday: Birthday) {
        if (favourites.includes(birthday)){
            return solidStar;
        }
        else return regularStar;
    }
    //helper function for testing icons
    function getIconString(birthday: Birthday){
        if (favourites.includes(birthday)){
            return "solid-star"
        }
        else return "regular-star";
    }

    function handleDateChange(date: dayjs.Dayjs): void {

        const month = date.month() + 1; //month index starts at 0
        const day = date.date();

        //clear list of birthdays when another date changes
        setBirthdays([]);
        
        //retrieve a list of birthdays from this API then add the "text" field to an array
        global.fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`)
          .then((response) =>  response.json())
          .then((data) => {
            if(data.births !== undefined){
                let birthdays = data.births.map((person: any) => {
                    return {
                      name: person.text,
                      date: date
                    };
                  });
                setBirthdays(birthdays);
            }
          })
          .catch((error) => {
            console.error(error);
          });
    }


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <h3>Birthday Calendar</h3> 
            <StaticDatePicker 
                displayStaticWrapperAs="desktop"
                openTo="day"
                value={value}
                
                onChange={(newValue: Dayjs | null) => {
                    if(newValue){
                        setValue(newValue);
                        handleDateChange(newValue);
                    }
                }}

                renderInput={(params: JSX.IntrinsicAttributes) => <TextField {...params}  inputProps={{ 'data-testid': 'calendar-input' }} />}
            />
            <div>
                {favourites.length > 0 &&
                <div>
                    <h4>Favourite Birthdays:</h4>
                    <ul className="fa-ul">
                        {favourites.map((favourite, index) => (
                        <li key={index}>
                            <span className="fa-li">
                            <FontAwesomeIcon icon={getIcon(favourite)} data-testid={getIconString(favourite)} onClick={() => handleFavouriteToggle(favourite)}/>
                            </span>
                            {favourite.name} ({favourite.date.format('MMMM D')})
                        </li>
                        ))}
                    </ul>
                </div>
                }
            </div>

            <div>
                {birthdays.length > 0 &&
                <div>
                    <h4>Famous birthdays on this date:</h4>
                    <ul className="fa-ul">
                        {birthdays.map((birthday, index) => (
                        <li key={index}>
                            <span className="fa-li">
                            <FontAwesomeIcon icon={getIcon(birthday)} data-testid={getIconString(birthday)} onClick={() => handleFavouriteToggle(birthday)}/>
                            </span>
                            {birthday.name}
                        </li>
                        ))}
                    </ul>
                </div>
                }
            </div>

        </LocalizationProvider>
            
        
    );
}

export default Calendar;
