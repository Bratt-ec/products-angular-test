export class ResultApi<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    public error?: string;
    private _value?: T;

    private constructor(isSuccess: boolean, error?: string, value?: T) {
        if (isSuccess && error) {
            throw new Error('InvalidOperation: A result cannot be successful and contain an error');
        }
        if (!isSuccess && !error) {
            throw new Error('InvalidOperation: A failing result needs to contain an error message');
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value;
    }

    public get value(): T {
        if (this.isFailure) {
            throw new Error('CANT_ACCESS_VALUE_ON_FAILURE');
        }
        return this._value as T;
    }

    // Factory method for Success
    public static success<T>(value: T): ResultApi<T> {
        return new ResultApi<T>(true, undefined, value);
    }

    // Factory method for Failure
    public static failure<T>(error: string): ResultApi<T> {
        return new ResultApi<T>(false, error);
    }
}
