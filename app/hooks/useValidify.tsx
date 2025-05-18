import { useCallback, useMemo, useState } from 'react';

type RuleResult = boolean | string;

type ExactMatchRules<T, K extends Array<keyof T>> = {
  [P in K[number]]: (value: T[P]) => RuleResult;
};

type ValidifyArgs<T, K extends Array<keyof T>> = {
  autoValidateOnChange?: boolean;
  requiredFields: K;
  rules: ExactMatchRules<T, K>;
};

/**
 * Example:
 * type User = {
 *   name: string,
 *   age: number
 * }
 * const { state, handleChange, isValid, getInvalidFields } = useValidify<User, ['name', 'age']>({
 *   requiredFields: ['name', 'age'],
 *   rules: {
 *     name: (name) => name.length > 0,
 *     age: (age) => age > 0
 *   }
 * });
 *
 * <form>
 *   <label>
 *     Name:
 *     <input type="text" value={state.name} onChange={(e) => handleChange('name', e.target.value)} />
 *   </label>
 *   <label>
 *     Age:
 *     <input type="number" value={state.age} onChange={(e) => handleChange('age', e.target.valueAsNumber)} />
 *   </label>
 *   <button disabled={!isValid}>Submit</button>
 *   {getInvalidFields().length > 0 && (
 *     <div>
 *       Invalid fields: {getInvalidFields().join(', ')}
 *     </div>
 *   )}
 * </form>
 *
 * @param requiredFields the fields which require to be validated
 * @param rules the functions which validate the fields
 * @param autoValidateOnChange whether to run validation on every change
 * @returns an object with the following properties:
 * - state: the current state of the form
 * - handleChange: a function which updates the state and runs validation
 * - isValid: whether all the required fields are valid
 * - getInvalidFields: an array of fields which are not valid
 * - resetState: a function which resets the state and the validation
 * - checkValidation: a function which runs the validation and updates the state
 */
export function useValidify<T, K extends Array<keyof T>>({
  requiredFields,
  rules,
  autoValidateOnChange = true
}: ValidifyArgs<T, K>) {
  const [state, setState] = useState<Partial<T> | T>({});
  const [stateValidation, setStateValidation] = useState<
    Partial<{
      [key in keyof T]: RuleResult;
    }>
  >({});

  const handleChange = useCallback(
    <F extends keyof T>(field: F, value: T[F]) => {
      setState((prev) => ({ ...prev, [field]: value }));
      if (autoValidateOnChange) {
        const rule = rules[field as K[number]] as (value: T[F]) => boolean;
        if (rule) {
          setStateValidation((prev) => ({
            ...prev,
            [field]: rule(value)
          }));
        }
      }
    },
    [rules, autoValidateOnChange]
  );

  const checkValidation = useCallback(() => {
    const newValidation: Partial<{ [key in keyof T]: RuleResult }> = {};
    for (const field of requiredFields) {
      const key = field as keyof T;
      const rule = rules[key] as (value: T[typeof key]) => RuleResult;
      const value = state[key];
      newValidation[key] = rule(value as T[typeof key]);
    }
    setStateValidation(newValidation);
  }, [requiredFields, rules, state]);

  const isValid = useMemo(() => {
    return requiredFields.every((field) => stateValidation[field] === true);
  }, [requiredFields, stateValidation]);

  const getInvalidFields = useMemo(() => {
    return requiredFields.filter((field) => stateValidation[field] !== true);
  }, [requiredFields, stateValidation]);

  const resetState = () => {
    setState({});
    setStateValidation({});
  };

  return {
    state,
    setState,
    stateValidation,
    handleChange,
    resetState,
    checkValidation,
    isValid,
    getInvalidFields
  };
}
