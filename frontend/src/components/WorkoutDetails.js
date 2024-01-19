import React, { useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState({
    title: workout.title,
    load: workout.load,
    reps: workout.reps,
  });

  const handleUpdate = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(`/api/workouts/${workout._id}`, {
        method: 'PATCH',
        body: JSON.stringify(editedWorkout),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'UPDATE_WORKOUT', payload: json });
        setIsEditing(false);
      } else {
        console.error('Update failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during update:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedWorkout({
      title: workout.title,
      load: workout.load,
      reps: workout.reps,
    });
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(`/api/workouts/${workout._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json });
    }
  };

  return (
    <div className="workout-details">
      {isEditing ? (
        <>
          <p>title</p>
          <input
            type="text"
            value={editedWorkout.title}
            onChange={(e) =>
              setEditedWorkout({ ...editedWorkout, title: e.target.value })
            }
          />
          <p>load</p>
          <input
            type="number"
            value={editedWorkout.load}
            onChange={(e) =>
              setEditedWorkout({ ...editedWorkout, load: e.target.value })
            }
          />
          <p>reps</p>
          <input
            type="number"
            value={editedWorkout.reps}
            onChange={(e) =>
              setEditedWorkout({ ...editedWorkout, reps: e.target.value })
            }
          />
          <button style={{ marginRight: '10px' }} onClick={handleUpdate}>
            Update
          </button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{workout.title}</h4>
          <p>
            <strong>Load (kg): </strong>
            {workout.load}
          </p>
          <p>
            <strong>Number of reps: </strong>
            {workout.reps}
          </p>
          <p>
            {formatDistanceToNow(new Date(workout.createdAt), {
              addSuffix: true,
            })}
          </p>
          <div className="wrap-around">
            <span
              className="material-symbols-outlined"
              onClick={() => setIsEditing(true)}
            >
              edit
            </span>
            <span className="material-symbols-outlined" onClick={handleDelete}>
              delete
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutDetails;
