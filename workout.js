// Workout functionality
let workouts = JSON.parse(localStorage.getItem('workouts')) || initializeWorkouts();
let completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts')) || 0;

function initializeWorkouts() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => ({
        day,
        exercise: '',
        muscleGroup: '',
        maxReps: '',
        completed: false,
        lastUpdated: null
    }));
}

document.addEventListener('DOMContentLoaded', function() {
    // Workout will be rendered when page is opened
});

function renderWorkout() {
    const workoutContainer = document.getElementById('workout-container');
    workoutContainer.innerHTML = '';

    // Add stats header
    const statsDiv = document.createElement('div');
    statsDiv.className = 'workout-stats';
    statsDiv.innerHTML = `
        <h3>Workout Progress</h3>
        <p>Completed Workouts: ${completedWorkouts} / 14</p>
        ${completedWorkouts >= 14 ? '<p style="color: #ffd700; font-weight: bold;">ðŸŽ‰ Time for progression!</p>' : ''}
    `;
    workoutContainer.appendChild(statsDiv);

    workouts.forEach((workout, index) => {
        const workoutDay = document.createElement('div');
        workoutDay.className = 'workout-day';

        const sets = calculateSets(workout.maxReps);
        const suggestion = getSuggestion(workout, completedWorkouts);

        workoutDay.innerHTML = `
            <div class="workout-day-header">
                <div class="workout-day-title">${workout.day}</div>
                <input type="checkbox" class="workout-checkbox" ${workout.completed ? 'checked' : ''}
                    onchange="toggleWorkoutComplete(${index})">
            </div>

            <div class="workout-form">
                <input type="text" class="workout-input" placeholder="Exercise name"
                    value="${workout.exercise}" oninput="updateWorkout(${index}, 'exercise', this.value)">
                <input type="text" class="workout-input" placeholder="Muscle group"
                    value="${workout.muscleGroup}" oninput="updateWorkout(${index}, 'muscleGroup', this.value)">
                <input type="number" class="workout-input" placeholder="Max reps"
                    value="${workout.maxReps}" oninput="updateWorkout(${index}, 'maxReps', this.value)">
            </div>

            ${workout.exercise && workout.maxReps ? `
                <div class="workout-display">
                    <h4>${workout.exercise}</h4>
                    <p><strong>Muscle Group:</strong> ${workout.muscleGroup || 'Not specified'}</p>
                    <p><strong>Workout Sets:</strong> ${sets}</p>
                </div>
            ` : ''}

            ${suggestion ? `
                <div class="workout-display workout-suggestion">
                    <h4>ðŸ’ª Progression Suggestion</h4>
                    <p>${suggestion}</p>
                </div>
            ` : ''}
        `;

        workoutContainer.appendChild(workoutDay);
    });
}

function updateWorkout(index, field, value) {
    workouts[index][field] = value;
    workouts[index].lastUpdated = new Date().toISOString();
    localStorage.setItem('workouts', JSON.stringify(workouts));
    renderWorkout();
}

function toggleWorkoutComplete(index) {
    workouts[index].completed = !workouts[index].completed;

    // Recalculate total completed workouts
    completedWorkouts = workouts.filter(w => w.completed).length;

    localStorage.setItem('workouts', JSON.stringify(workouts));
    localStorage.setItem('completedWorkouts', completedWorkouts);

    // Check if we hit 14 completions
    if (completedWorkouts === 14) {
        setTimeout(() => {
            alert('ðŸŽ‰ Congratulations! You\'ve completed 14 workouts! Time to increase your intensity!');
        }, 300);
    }

    renderWorkout();
}

function calculateSets(maxReps) {
    if (!maxReps || maxReps <= 0) return '3 Ã— N/A';

    const repsPerSet = Math.round(maxReps * 0.75); // 75% of max
    return `3 Ã— ${repsPerSet}`;
}

function getSuggestion(workout, totalCompleted) {
    if (totalCompleted < 14 || !workout.exercise || !workout.maxReps) {
        return null;
    }

    const maxReps = parseInt(workout.maxReps);
    const newReps = Math.ceil(maxReps * 1.15); // Increase by 15%

    // Exercise progressions
    const progressions = {
        'push up': 'Diamond Push Ups',
        'push ups': 'Diamond Push Ups',
        'pushup': 'Diamond Push Ups',
        'pushups': 'Diamond Push Ups',
        'squat': 'Jump Squats',
        'squats': 'Jump Squats',
        'plank': 'Plank with Leg Raise',
        'sit up': 'Bicycle Crunches',
        'sit ups': 'Bicycle Crunches',
        'situp': 'Bicycle Crunches',
        'situps': 'Bicycle Crunches',
        'pull up': 'Weighted Pull Ups',
        'pull ups': 'Weighted Pull Ups',
        'pullup': 'Weighted Pull Ups',
        'pullups': 'Weighted Pull Ups',
        'lunge': 'Walking Lunges',
        'lunges': 'Walking Lunges',
    };

    const exerciseLower = workout.exercise.toLowerCase();
    const progression = progressions[exerciseLower];

    if (progression) {
        return `Try ${progression} OR increase to 3 Ã— ${Math.round(newReps * 0.75)} reps`;
    } else {
        return `Increase to 3 Ã— ${Math.round(newReps * 0.75)} reps (based on new max: ${newReps})`;
    }
}
