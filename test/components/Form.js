jest.unmock('../../lib/components/Form');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Chance from 'chance';
import Form from '../../lib/components/Form';
const noop = () => {};

describe('Form tests', () => {
  const chance = new Chance();

  describe('Init value tests', () => {

    it('should have the correct values', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const value = chance.string();

      form.initValue({name, value});

      const expected = {value, hasBeenTouched: false, error: null};
      expect(form.state.fields[name]).toEqual(expected);
    });
  });

  describe('Set value tests', () => {
    it('should set the value and not contain an error for a field without a validator', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const value = chance.string();
      const value2 = chance.string();

      form.setState({fields: {[name]: {value}}});

      form.setValue({name, value: value2});

      const expected = {value: value2, hasBeenTouched: true, error: null};
      expect(form.state.fields[name]).toEqual(expected);
    });

    it('should set the value and contain an error when the validator returns a string', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const value = chance.string();
      const value2 = chance.string();
      const error = chance.string();
      const required = true;
      const validator = jest.fn();
      validator.mockReturnValueOnce(error);

      form.setState({fields: {[name]: {value, validator, required}}});

      form.setValue({name, value: value2});

      const expected = {value: value2, hasBeenTouched: true, error, validator, required};
      expect(form.state.fields[name]).toEqual(expected);
      expect(validator.mock.calls.length).toBe(1);
    });
  });

  describe('Get field tests', () => {
    it('should get a field that exists', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const value = chance.string();

      form.setState({fields: {[name]: {value}}});

      expect(form.getField(name)).toEqual({value});
    });

    it('should not get a field that does not exist', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();

      expect(form.getField(name)).toBeUndefined();
    });
  });

  describe('Set has been touched tests', () => {
    it('should set the field to touched', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const value = chance.string();

      form.setState({fields: {[name]: {value}}});
      form.setHasBeenTouched(name);

      const expected = {value, hasBeenTouched: true, error: null};
      expect(form.state.fields[name]).toEqual(expected);
    });

    it('should set the field to not touched', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const value = chance.string();

      form.setState({fields: {[name]: {value}}});
      form.setHasBeenTouched(name, false);

      const expected = {value, hasBeenTouched: false, error: null};
      expect(form.state.fields[name]).toEqual(expected);
    });

    it('shoud set can submit to true if we are able to submit after a field has been touched', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const required = true;

      form.setState({fields: {[name]: {required}}});
      form.setHasBeenTouched(name);

      expect(form.state.canSubmit).toBe(true);
    });
  });

  describe('Can Submit Tests', () => {
    it('should be submittable with an empty form', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);

      expect(form.canSubmit()).toBe(true);
    });

    it('should be submittable when there are no required fields', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const value = chance.string();

      form.setState({fields: {[name]: {value}}});

      expect(form.canSubmit()).toBe(true);
    }),

    it('should not be submittable when a required field has not been edited', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const value = chance.string();
      const required = true;
      const error = chance.string();
      const validator = jest.fn();

      form.setState({fields: {[name]: {name, value, validator, required}}});

      expect(validator).not.toBeCalled();
      expect(form.canSubmit()).toBe(false);
    });

    it('should be submittable when a required field is valid', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const value = chance.string();
      const required = true;
      const validator = jest.fn();
      const noError = null;

      validator.mockReturnValueOnce(noError);

      form.setState({fields: {[name]: {name, value, validator, required}}});
      form.setValue({name, value});

      expect(form.canSubmit()).toBe(true);
      expect(validator).toBeCalled();
    });

    it('should not be submittable when a required field is invalid', () => {
      const form = TestUtils.renderIntoDocument(<Form submit={noop} />);
      const name = chance.string();
      const value = chance.string();
      const required = true;
      const validator = jest.fn();
      const error = chance.string();

      validator.mockReturnValueOnce(error);

      form.setState({fields: {[name]: {value, validator, required}}});
      form.setValue({name, value});

      expect(form.canSubmit()).toBe(false);
      expect(validator).toBeCalled();
    });
  });

  describe('Submit form tests', () => {
    it(`should call the submit function`, () => {
      const submit = jest.fn((values, callback) => {
        expect(form.state.isSubmitting).toBe(true);
        callback();
      });

      const form = TestUtils.renderIntoDocument(<Form submit={submit} />);

      expect(form.state.isSubmitting).toBe(false);
      form.submitForm();
      expect(form.state.isSubmitting).toBe(false);
    });

    it('should call the submit callback with values and a callback function', () => {
      const submit = jest.fn((values, callback) => {
        expect(form.state.isSubmitting).toBe(true);
        callback();
      });

      const form = TestUtils.renderIntoDocument(<Form submit={submit} />);
      const name = chance.string();
      const value = chance.string();

      form.setState({fields: {[name]: {value}}});

      form.submitForm();
      expect(submit).toBeCalledWith({[name]: value}, jasmine.any(Function));
    });
  });
});