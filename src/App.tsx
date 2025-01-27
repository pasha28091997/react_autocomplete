import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

interface Props {
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const previousQuery = useRef<string>('');
  const titleField = useRef<HTMLInputElement>(null);

  const applyQuery = useCallback(
    debounce((value: string) => {
      if (value !== previousQuery.current) {
        setAppliedQuery(value);
        previousQuery.current = value;
      }
    }, delay),
    [delay],
  );

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const filteredPeople = useMemo(() => {
    if (!appliedQuery) {
      return isFocused ? peopleFromServer : [];
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, isFocused]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    applyQuery(value);

    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected?.(null);
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    onSelected?.(person);
  };

  // const handleSuggestionClick = (personName: string) => {
  //   setQuery(personName);
  //   setIsFocused(false);
  //   // setFilteredPeople([]);
  // };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  // const handleBlur = () => {
  //   setTimeout(() => setIsFocused(false), 200);
  // };

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              ref={titleField}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="dropdown-menu" role="menu">
            {isFocused && !appliedQuery && (
              <div className="dropdown-content" data-cy="suggestions-list">
                {filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    onClick={() => handleSuggestionClick(person)}
                    data-cy="suggestion-item"
                    style={{ cursor: 'pointer' }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredPeople.length === 0 && query && (
            <div
              className="
                notification
                is-danger
                is-light
                mt-3
                is-align-self-flex-start
              "
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// useEffect(() => {
//   const filteredPeoples = peopleFromServer.filter(person =>
//     person.name.toLowerCase().includes(query.toLowerCase()),
//   );

//   setFilteredPeople(filteredPeoples);
// }, [query]);

// setFilteredPeople(filteredPeoples);

// const handleFocus = () => {
//   if (!query) {
//     setFilteredPeople(peopleFromServer);
//   }
// };

// useEffect(() => {
//   const delayTimer = setTimeout(() => {
//     setDebouncedQuery(query);
//   }, delay);

//   return () => clearTimeout(delayTimer);
// }, [query, delay]);

// useEffect(() => {
//   if (debouncedQuery) {
//     const results = peopleFromServer.filter(person =>
//       person.name.toLowerCase().includes(query.toLowerCase()),
//     );

//     setFilteredPeople(results);
//   }
// }, [debouncedQuery]);

// <div className="dropdown-menu" role="menu">
//   <div className="dropdown-content">
//     {filteredPeople.length > 0
//       ? filteredPeople.map(person => (
//         <div
//           key={person.slug}
//           className="dropdown-item"
//           data-value={person.name}
//         >
//           <p className="has-text-link">{person.name}</p>
//         </div>
//       ))
//       : query && (
//         <div
//           className="notification is-danger is-light mt-3 is-align-self-flex-start"
//           role="alert"
//           data-cy="no-suggestions-message"
//         >
//           <p className="has-text-danger">No matching suggestions</p>
//         </div>

{
  /* <div className="dropdown-menu" role="menu">
    <div className="dropdown-content">
      {filteredPeople.map(person => (
        <div
          key={person.slug}
          className="dropdown-item"
          data-value={person.name}
        >
          <p className="has-text-link">{person.name}</p>
        </div>
      ))}
    </div>
  </div>

  {query && filteredPeople.length === 0 && (
    <div
      className="
        notification
        is-danger
        is-light
        mt-3
        is-align-self-flex-start
      "
      role="alert"
      data-cy="no-suggestions-message"
    >
      <p className="has-text-danger">No matching suggestions</p>
    </div>
  )} */
}
// return (
//   <div className="container">
//     <main className="section is-flex is-flex-direction-column">
//       <h1 className="title" data-cy="title">
//         {`${name} (${born} - ${died})`}
//       </h1>

//       <div className="dropdown is-active">
//         <div className="dropdown-trigger">
//           <input
//             type="text"
//             placeholder="Enter a part of the name"
//             className="input"
//             data-cy="search-input"
//             value={query}
//             onChange={handleQueryChange}
//           />
//         </div>

//         <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
//           <div className="dropdown-content">
//             {peopleFromServer.map(user => (
//               <div
//                 className="dropdown-item"
//                 data-cy="suggestion-item"
//                 data-value={user.name}
//                 key={user.slug}
//               >
//                 <p className="has-text-link">{user.name}</p>
//               </div>
//               // <option value={user.id} key={user.id}>
//               //   {user.name}
//               // </option>
//             ))}
//             <div className="dropdown-item" data-cy="suggestion-item">
//               <p className="has-text-link">Pieter Haverbeke</p>
//             </div>

//             <div className="dropdown-item" data-cy="suggestion-item">
//               <p className="has-text-link">Pieter Bernard Haverbeke</p>
//             </div>

//             <div className="dropdown-item" data-cy="suggestion-item">
//               <p className="has-text-link">Pieter Antone Haverbeke</p>
//             </div>

//             <div className="dropdown-item" data-cy="suggestion-item">
//               <p className="has-text-danger">Elisabeth Haverbeke</p>
//             </div>

//             <div className="dropdown-item" data-cy="suggestion-item">
//               <p className="has-text-link">Pieter de Decker</p>
//             </div>

//             <div className="dropdown-item" data-cy="suggestion-item">
//               <p className="has-text-danger">Petronella de Decker</p>
//             </div>

//             <div className="dropdown-item" data-cy="suggestion-item">
//               <p className="has-text-danger">Elisabeth Hercke</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div
//         className="
//           notification
//           is-danger
//           is-light
//           mt-3
//           is-align-self-flex-start
//         "
//         role="alert"
//         data-cy="no-suggestions-message"
//       >
//         <p className="has-text-danger">No matching suggestions</p>
//       </div>
//     </main>
//   </div>
// );
