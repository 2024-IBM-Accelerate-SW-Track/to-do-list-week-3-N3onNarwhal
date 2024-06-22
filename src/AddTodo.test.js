import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render duplicate Task', () => {
  render(<App />);

  // create task
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i });
  fireEvent.change(inputTask, {target: {value: "History Test"}});
  fireEvent.change(inputDate, {target: {value: "06/30/2025"}});
  fireEvent.click(element);

  // try to create duplicate
  fireEvent.change(inputTask, {target: {value: "History Test"}});
  fireEvent.change(inputDate, {target: {value: "06/30/2025"}});
  fireEvent.click(element);

  // ensure there is only one on screen
  const check = screen.getAllByText(/History Test/i);
  expect(check.length).toEqual(1);

 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);

  // create task
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const butt = screen.getByRole('button', {name: /Add/i});
  fireEvent.change(inputTask, {target: {value: ""}});
  fireEvent.change(inputDate, {target: {value: "06/30/2025"}});
  fireEvent.click(butt);

  // check task does not exist
  const check = screen.queryByText("06/30/2025");
  expect(check).toBeNull();

 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);

  // create task
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const butt = screen.getByRole('button', {name: /Add/i});
  fireEvent.change(inputTask, {target: {value: "History Test"}});
  fireEvent.change(inputDate, {target: {value: null}});
  fireEvent.click(butt);

  // check task does not exist
  const check = screen.queryByText("History Test");
  expect(check).toBeNull();

 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);

  // create task
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const butt = screen.getByRole('button', {name: /Add/i});
  fireEvent.change(inputTask, {target: {value: "History Test"}});
  fireEvent.change(inputDate, {target: {value: "06/30/2025"}});
  fireEvent.click(butt);

  // delete and check task does not exist
  const box = screen.getByTestId("cBox");
  fireEvent.click(box);
  const check = screen.queryByText("History Test");
  expect(check).toBeNull();

 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);

  // create normal task
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const butt = screen.getByRole('button', {name: /Add/i});
  fireEvent.change(inputTask, {target: {value: "History Test"}});
  fireEvent.change(inputDate, {target: {value: "06/30/2025"}});
  fireEvent.click(butt);

  // create overdue task
  fireEvent.change(inputTask, {target: {value: "Science Test"}});
  fireEvent.change(inputDate, {target: {value: "01/01/2023"}});
  fireEvent.click(butt);

  // check tasks exist
  const normalTask = screen.getByTestId(/History Test/i);
  expect(normalTask).toBeInTheDocument();
  const overdueTask = screen.getByTestId(/Science Test/i);
  expect(overdueTask).toBeInTheDocument();

  // compare colors
  const normalColor = normalTask.style.backgroundColor;
  const overdueColor = overdueTask.style.backgroundColor;
  expect(normalColor).not.toBe(overdueColor);

 });
