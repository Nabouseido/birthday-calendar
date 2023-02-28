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
}

function Calendar() {

    const [value, setValue] = useState(dayjs());
    const [birthdays, setBirthdays] = useState<Birthday[]>([]);
    const [favourites, setFavourites] = useState<string[]>([]);

    //intialize birthday list with today's date on first render
    useEffect(() => {
        handleDateChange(dayjs());
    }, []);

    //called when the user selects the star icon to toggle the "favourite" state
    const handleFavouriteToggle = (personName: string) => {
        if (favourites.includes(personName)) {
            setFavourites(favourites.filter(name => name !== personName));
        } else {
            setFavourites([...favourites, personName]);
        }
    };

    //solid star icon is used to represent a "favourited" birthday
    function getIcon(name: string) {
        if (favourites.includes(name)){
            return solidStar;
        }
        else return regularStar;
    }


    function handleDateChange(date: dayjs.Dayjs): void {

        const month = date.month() + 1; //month index starts at 0
        const day = date.date();

        //clear list of birthdays when another date changes
        setBirthdays([]);
        
        //retrieve a list of birthdays from this API then add the "text" field to an array
        fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`)
          .then((response) =>  response.json())
          .then((data) => {
            let birthdays = data.births.map((person: any) => {
                return {
                  name: person.text
                };
              });
            setBirthdays(birthdays);
          })
          .catch((error) => {
            console.error(error);
          });
    }


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                renderInput={(params: JSX.IntrinsicAttributes) => <TextField {...params} />}
            />
            <div>
                {favourites.length > 0 &&
                <div>
                    <h4>Favourite Birthdays:</h4>
                    <ul className="fa-ul">
                        {favourites.map((favourite, index) => (
                        <li key={index}>
                            <span className="fa-li">
                            <FontAwesomeIcon icon={getIcon(favourite)} onClick={() => handleFavouriteToggle(favourite)}/>
                            </span>
                            {favourite}
                        </li>
                        ))}
                    </ul>
                </div>
                }
            </div>

            <div>
                {birthdays.length > 0 &&
                <div>
                    <h4> Famous birthdays on this date:</h4>
                    <ul className="fa-ul">
                        {birthdays.map((birthday, index) => (
                        <li key={index}>
                            <span className="fa-li">
                            <FontAwesomeIcon icon={getIcon(birthday.name)} onClick={() => handleFavouriteToggle(birthday.name)}/>
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
