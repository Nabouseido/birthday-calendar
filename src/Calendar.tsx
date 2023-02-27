import React, { useState } from "react";
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';


interface Birthday {
  name: string;
  date: string;
  isFavorite: boolean;
}


function Calendar() {

    const [value, setValue] = useState(dayjs());

    //const [birthdays, setBirthdays] = React.useState([]);
    const [birthdays, setBirthdays] = useState<Birthday[]>([]);

 
    function handleDateChange(date: dayjs.Dayjs): void {

        const month = date.month() + 1; //month index starts at 0
        const day = date.date();
        
        //retrieve a list of birthdays from this API then add the "text" field to an array
        fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`)
          .then((response) =>  response.json())
          .then((data) => {
            const birthdays = data.births.map((person: any) => {
                return {
                  name: person.text,
                  date: `${person.year}-${month}-${day}`
                };
              });
            setBirthdays(birthdays);

          })
          .catch((error) => {
            console.error(error);
          });
    }
    

    return (
        <span className="Birthday-Calendar">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={value}
            onChange={(newValue: any ) => {
                setValue(newValue);
                handleDateChange(newValue);
            }}
            renderInput={(params: JSX.IntrinsicAttributes) => <TextField {...params} />}
            />

            <div>
                {birthdays.length > 0 &&
                <div>
                    <ul>
                        {birthdays.map((birthday, index) => (
                        <li key={index}>
                            <span>{birthday.name}</span>
                            {/* <button onClick={() => toggleFavorite(index)}>Favorite</button> */}
                        </li>
                        ))}
                    </ul>
                </div>
                }
            </div>
            
        </LocalizationProvider>
        </span>
            
        
    );
}

export default Calendar;
