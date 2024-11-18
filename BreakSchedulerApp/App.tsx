import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import moment from 'moment';


const App = () => {
  const [name, setName] = useState('');
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState([]);


  // Add Employee to the List
  const addEmployee = () => {
    if (!name || !shiftStart || !shiftEnd) {
      Alert.alert('Error', 'Please fill all fields!');
      return;
    }


    const shiftStartTime = moment(shiftStart, 'HH:mm');
    const shiftEndTime = moment(shiftEnd, 'HH:mm');


    if (!shiftStartTime.isValid() || !shiftEndTime.isValid()) {
      Alert.alert('Error', 'Invalid time format. Use HH:mm.');
      return;
    }


    if (shiftStartTime.isAfter(shiftEndTime)) {
      Alert.alert('Error', 'Shift start time must be before shift end time.');
      return;
    }


    setEmployees((prev) => [
      ...prev,
      { name, shiftStart: shiftStartTime, shiftEnd: shiftEndTime },
    ]);


    // Clear inputs
    setName('');
    setShiftStart('');
    setShiftEnd('');
  };


  // Generate Break Schedule
  const generateSchedule = () => {
    if (employees.length === 0) {
      Alert.alert('Error', 'Add at least one employee to generate a schedule.');
      return;
    }
 
    const occupiedBreaks = [];
    const findNextAvailableTime = (proposedTime, breakDuration) => {
      while (occupiedBreaks.includes(proposedTime.format('HH:mm'))) {
        proposedTime.add(15, 'minutes'); // Stagger by 15 minutes
      }
      occupiedBreaks.push(proposedTime.format('HH:mm'));
      return proposedTime;
    };
 
    const generatedSchedule = employees.map((employee) => {
      const shiftDuration = employee.shiftEnd.diff(employee.shiftStart, 'hours');
 
      let firstBreak = null;
      let lunchBreak = null;
      let secondBreak = null;
 
      if (shiftDuration < 6) {
        // Single break
        const midBreak = employee.shiftStart.clone().add((shiftDuration * 60) / 2, 'minutes');
        firstBreak = findNextAvailableTime(midBreak, 15);
      } else {
        // Standard breaks
        const proposedFirstBreak = employee.shiftStart.clone().add(2, 'hours');
        firstBreak = findNextAvailableTime(proposedFirstBreak, 15);
 
        const proposedLunchBreak = employee.shiftStart.clone().add(4, 'hours');
        lunchBreak = findNextAvailableTime(proposedLunchBreak, 30);
 
        const proposedSecondBreak = employee.shiftStart.clone().add(6, 'hours');
        secondBreak = findNextAvailableTime(proposedSecondBreak, 15);
 
        // Ensure breaks don't exceed shift end
        if (firstBreak.clone().add(15, 'minutes').isAfter(employee.shiftEnd)) firstBreak = null;
        if (lunchBreak && lunchBreak.clone().add(30, 'minutes').isAfter(employee.shiftEnd)) lunchBreak = null;
        if (secondBreak && secondBreak.clone().add(15, 'minutes').isAfter(employee.shiftEnd)) secondBreak = null;
      }
 
      return {
        name: employee.name,
        shift: `${employee.shiftStart.format('HH:mm')} - ${employee.shiftEnd.format('HH:mm')}`,
        firstBreak: firstBreak ? firstBreak.format('HH:mm') : 'None',
        lunchBreak: lunchBreak ? lunchBreak.format('HH:mm') : 'None',
        secondBreak: secondBreak ? secondBreak.format('HH:mm') : 'None',
        startTime: employee.shiftStart, // Add startTime for sorting
      };
    });
 
    // Sort by shift start time
    const sortedSchedule = generatedSchedule.sort((a, b) => a.startTime.diff(b.startTime));
 
    setSchedule(sortedSchedule);
  };
 


  // Reset All Data
  const resetData = () => {
    setName('');
    setShiftStart('');
    setShiftEnd('');
    setEmployees([]);
    setSchedule([]);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Break Schedule</Text>


      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Shift Start (HH:mm)"
        value={shiftStart}
        onChangeText={setShiftStart}
      />
      <TextInput
        style={styles.input}
        placeholder="Shift End (HH:mm)"
        value={shiftEnd}
        onChangeText={setShiftEnd}
      />
      <Button title="Add Employee" onPress={addEmployee} />


      <View style={styles.divider} />
      <Button title="Generate Schedule" onPress={generateSchedule} />
      <View style={styles.divider} />
      <Button title="Reset All" onPress={resetData} color="red" />


      <FlatList
        data={schedule}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.name}: Shift ({item.shift}), First Break: {item.firstBreak}, Lunch Break: {item.lunchBreak}, Second Break: {item.secondBreak}
          </Text>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No schedule generated yet.</Text>}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
  },
});


export default App;

